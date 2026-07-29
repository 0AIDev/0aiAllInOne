import { prisma } from "@/lib/prisma";
import type {
  Provider,
  ProviderModel,
  ProviderKey,
  ProviderPoolEntry,
} from "@prisma/client";

interface ResolvedProvider {
  provider: Provider;
  model: ProviderModel;
  key: ProviderKey & { decryptedKey: string };
  poolEntry: ProviderPoolEntry;
}

interface GatewayContext {
  tenantId: string;
  apiKeyId?: string;
  requestModel: string;
  strategy: "PRIORITY" | "COST_OPTIMIZED" | "FUSION" | "LEAST_USED";
}

interface RouterResult {
  provider: ResolvedProvider;
  fallbackChain: string[];
}

export class GatewayRouter {
  /**
   * Select the best provider for a request, with automatic fallback.
   * Returns the selected provider and the fallback chain attempted.
   */
  static async selectProvider(
    ctx: GatewayContext
  ): Promise<RouterResult> {
    const fallbackChain: string[] = [];

    // 1. Get tenant's provider pool
    const tenantId = ctx.tenantId;

    const poolEntries = await prisma.providerPoolEntry.findMany({
      where: { tenantId, isEnabled: true },
      include: {
        provider: true,
        model: true,
      },
      orderBy: { priority: "asc" },
    });

    // 2. Filter entries matching the requested model
    const matchingEntries = poolEntries.filter((entry) => {
      return (
        entry.model.modelId === ctx.requestModel ||
        ctx.requestModel.startsWith(`${entry.provider.slug}/`) ||
        entry.model.modelId.startsWith(ctx.requestModel.replace(/\/.*$/, ""))
      );
    });

    if (matchingEntries.length === 0) {
      throw new GatewayError("NO_MATCHING_PROVIDER", `No provider found for model: ${ctx.requestModel}`);
    }

    // 3. Sort by strategy
    const sorted = this.sortByStrategy(matchingEntries, ctx.strategy);

    // 4. Try each provider, return first healthy one
    for (const entry of sorted) {
      const targetModel = entry.model;
      if (!targetModel.isActive) continue;

      fallbackChain.push(`${entry.provider.slug}/${targetModel.modelId}`);

      if (entry.provider.status === "DOWN" || entry.provider.status === "DISABLED") {
        continue;
      }

      // Check health
      const healthOk = await this.checkProviderHealth(entry.provider.id);
      if (!healthOk) continue;

      // Pick best key
      const selectedKey = await this.selectBestKey(entry.provider.id);
      if (!selectedKey) continue;

      return {
        provider: {
          provider: entry.provider,
          model: targetModel,
          key: selectedKey,
          poolEntry: entry,
        },
        fallbackChain,
      };
    }

    throw new GatewayError(
      "ALL_PROVIDERS_FAILED",
      `All providers failed for model: ${ctx.requestModel}. Chain: ${fallbackChain.join(" → ")}`
    );
  }

  private static sortByStrategy(
    entries: Array<
      ProviderPoolEntry & {
        provider: Provider;
        model: ProviderModel;
      }
    >,
    strategy: GatewayContext["strategy"]
  ) {
    switch (strategy) {
      case "PRIORITY":
        return [...entries].sort(
          (a, b) => a.priority - b.priority
        );
      case "COST_OPTIMIZED":
        return [...entries].sort((a, b) => {
          // Assume model info for cost comparison - simplified
          return a.priority - b.priority;
        });
      case "LEAST_USED":
        return [...entries].sort((a, b) => a.priority - b.priority);
      case "FUSION":
        // Shuffle with weight bias
        return [...entries]
          .map((e) => ({ e, sort: Math.random() / e.weight }))
          .sort((a, b) => a.sort - b.sort)
          .map((x) => x.e);
      default:
        return entries;
    }
  }

  private static async checkProviderHealth(
    providerId: string
  ): Promise<boolean> {
    const health = await prisma.providerHealthCheck.findFirst({
      where: { providerId },
      orderBy: { lastCheckedAt: "desc" },
    });

    if (!health) return true;
    if (health.consecutiveFails >= 5) return false;
    if (health.errorRate > 50) return false;

    return true;
  }

  private static async selectBestKey(
    providerId: string
  ): Promise<(ProviderKey & { decryptedKey: string }) | null> {
    const { decrypt } = await import("@/lib/utils/encryption");

    const keys = await prisma.providerKey.findMany({
      where: {
        providerId,
        isActive: true,
        OR: [
          { cooldownUntil: null },
          { cooldownUntil: { lte: new Date() } },
        ],
      },
      orderBy: [
        { consecutiveFails: "asc" },
        { priority: "asc" },
        { lastErrorAt: { sort: "asc", nulls: "first" } },
      ],
      take: 1,
    });

    const key = keys[0];
    if (!key) return null;

    return {
      ...key,
      decryptedKey: decrypt(key.encryptedKey),
    };
  }

  static async markKeyError(keyId: string, errorMsg: string) {
    await prisma.providerKey.update({
      where: { id: keyId },
      data: {
        consecutiveFails: { increment: 1 },
        lastErrorAt: new Date(),
        lastErrorMsg: errorMsg,
        cooldownUntil: new Date(Date.now() + 30_000),
      },
    });
  }

  static async markKeySuccess(keyId: string) {
    await prisma.providerKey.update({
      where: { id: keyId },
      data: {
        consecutiveFails: 0,
        lastErrorAt: null,
        lastErrorMsg: null,
        cooldownUntil: null,
      },
    });
  }

  static async updateProviderHealth(
    providerId: string,
    success: boolean,
    latencyMs: number
  ) {
    const health = await prisma.providerHealthCheck.findFirst({
      where: { providerId },
      orderBy: { lastCheckedAt: "desc" },
    });

    if (!health) {
      await prisma.providerHealthCheck.create({
        data: {
          providerId,
          status: success ? "ACTIVE" : "DEGRADED",
          latencyMs,
          errorRate: success ? 0 : 100,
          successRate: success ? 100 : 0,
          consecutiveFails: success ? 0 : 1,
          lastCheckedAt: new Date(),
          lastSuccessAt: success ? new Date() : null,
        },
      });
      return;
    }

    const totalChecks = 10;
    const newErrorRate =
      (health.errorRate * (totalChecks - 1) + (success ? 0 : 100)) / totalChecks;
    const newSuccessRate =
      (health.successRate * (totalChecks - 1) + (success ? 100 : 0)) / totalChecks;

    await prisma.providerHealthCheck.update({
      where: { id: health.id },
      data: {
        status: newErrorRate > 50 ? "DEGRADED" : "ACTIVE",
        latencyMs: Math.round((health.latencyMs + latencyMs) / 2),
        errorRate: Math.round(newErrorRate * 100) / 100,
        successRate: Math.round(newSuccessRate * 100) / 100,
        consecutiveFails: success ? 0 : health.consecutiveFails + 1,
        lastCheckedAt: new Date(),
        lastSuccessAt: success ? new Date() : health.lastSuccessAt,
      },
    });
  }
}

export class GatewayError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 502
  ) {
    super(message);
    this.name = "GatewayError";
  }
}
