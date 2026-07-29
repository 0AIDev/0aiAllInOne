// ============================================================
// AI0FY — P2C (Power of Two Choices) Credential Selection
// Pattern: OmniRoute src/sse/services/auth.ts
// ============================================================

import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/utils/encryption";
import { breakers } from "./circuit-breaker";

interface ProviderCredential {
  keyId: string;
  providerId: string;
  label: string | null;
  decryptedKey: string;
  priority: number;
  consecutiveFails: number;
  cooldownUntil: Date | null;
  quotaRemaining: number | null;
}

interface ProviderModelInfo {
  id: string;
  modelId: string;
  costPer1kInput: number;
  costPer1kOutput: number;
  contextWindow: number;
  supportsTools: boolean;
  supportsVision: boolean;
}

interface PoolTarget {
  provider: {
    id: string;
    name: string;
    slug: string;
    baseUrl: string;
    apiKeyHeader: string;
    apiKeyPrefix: string;
    status: string;
    priority: number;
  };
  model: ProviderModelInfo;
  poolPriority: number;
  poolWeight: number;
}

interface SelectedProvider {
  target: PoolTarget;
  credential: ProviderCredential;
  fallbackChain: string[];
}

export class P2CRouter {
  /**
   * Power of Two Choices credential selection.
   * Picks 2 random candidates, compares scores, returns the best.
   */
  static p2cSelect(credentials: ProviderCredential[]): ProviderCredential | null {
    if (credentials.length === 0) return null;
    if (credentials.length === 1) {
      const c = credentials[0]!;
      return c.cooldownUntil && c.cooldownUntil > new Date() ? null : c;
    }

    // Pick 2 random indices
    const i1 = Math.floor(Math.random() * credentials.length);
    let i2 = Math.floor(Math.random() * (credentials.length - 1));
    if (i2 >= i1) i2++;

    const c1 = credentials[i1]!;
    const c2 = credentials[i2]!;

    return this.score(c1) <= this.score(c2) ? c1 : c2;
  }

  /**
   * Score a credential — lower is better.
   * Error penalties: 429 (rate limit) → +24, 401/403 → +18, 5xx → +10
   * Backoff: +8 per level, max 40
   * Quota: headroom ≤10% → +10, ≤25% → +4
   * Consecutive use: +2 per use, max 12
   * Recency: <15s → +3, <60s → +2, <5min → +1
   * Priority: +1 per level above 1, max 6
   */
  private static score(c: ProviderCredential): number {
    let s = 0;

    // Error penalty based on consecutive fails
    s += Math.min(c.consecutiveFails * 8, 40);

    // Quota penalty
    if (c.quotaRemaining !== null) {
      if (c.quotaRemaining <= 10) s += 10;
      else if (c.quotaRemaining <= 25) s += 4;
    }

    // Priority penalty
    s += Math.min(Math.max(0, (c.priority - 1) * 1), 6);

    return s;
  }

  /**
   * Fill-First strategy — pick first available credential.
   */
  static fillFirstSelect(credentials: ProviderCredential[]): ProviderCredential | null {
    for (const c of credentials) {
      if (c.cooldownUntil && c.cooldownUntil > new Date()) continue;
      return c;
    }
    return null;
  }

  /**
   * Main entry point: select the best provider for a model request.
   */
  static async selectProvider(
    tenantId: string,
    requestModel: string
  ): Promise<SelectedProvider> {
    const fallbackChain: string[] = [];

    // 1. Get tenant's enabled pool entries
    const poolEntries = await prisma.providerPoolEntry.findMany({
      where: { tenantId, isEnabled: true },
      include: {
        provider: true,
        model: true,
      },
      orderBy: { priority: "asc" },
    });

    // 2. Filter entries matching the requested model
    const matching = poolEntries.filter((entry) => {
      const mid = entry.model.modelId;
      const slug = entry.provider.slug;
      return (
        mid === requestModel ||
        requestModel === `${slug}/${mid}` ||
        requestModel.startsWith(`${slug}/`) ||
        mid === requestModel.replace(/^.*\//, "")
      );
    });

    if (matching.length === 0) {
      throw new RoutingError(
        "NO_MATCHING_PROVIDER",
        `No provider found for model: ${requestModel}`
      );
    }

    // 3. Sort by pool priority, then provider priority
    const sorted = matching.sort(
      (a, b) => a.priority - b.priority || a.provider.priority - b.provider.priority
    );

    // 4. Try each target in order
    const triedCredentials = new Set<string>();

    for (const entry of sorted) {
      const provider = entry.provider;
      const model = entry.model;

      // Check provider circuit breaker
      const providerBreaker = `provider:${provider.id}`;
      if (!breakers.isAvailable(providerBreaker)) {
        fallbackChain.push(`${provider.slug}/${model.modelId} (open circuit)`);
        continue;
      }

      // Check model circuit breaker
      const modelBreaker = `model:${provider.id}:${model.modelId}`;
      if (!breakers.isAvailable(modelBreaker)) {
        fallbackChain.push(`${provider.slug}/${model.modelId} (model cooldown)`);
        continue;
      }

      // Check provider status
      if (provider.status === "DOWN" || provider.status === "DISABLED") {
        fallbackChain.push(`${provider.slug}/${model.modelId} (${provider.status})`);
        continue;
      }

      fallbackChain.push(`${provider.slug}/${model.modelId}`);

      // For no-auth providers (OpenCode, Pollinations, G4F, etc.), create synthetic credential
      if (!provider.needsAuth) {
        return {
          target: {
            provider: {
              id: provider.id,
              name: provider.name,
              slug: provider.slug,
              baseUrl: provider.baseUrl,
              apiKeyHeader: provider.apiKeyHeader,
              apiKeyPrefix: provider.apiKeyPrefix,
              status: provider.status,
              priority: provider.priority,
            },
            model,
            poolPriority: entry.priority,
            poolWeight: entry.weight,
          },
          credential: {
            keyId: `noauth-${provider.id}`,
            providerId: provider.id,
            label: `${provider.name} (Free)`,
            decryptedKey: "",
            priority: 0,
            consecutiveFails: 0,
            cooldownUntil: null,
            quotaRemaining: null,
          },
          fallbackChain,
        };
      }

      // 5. Get active keys for this provider, sorted by score
      const keys = await prisma.providerKey.findMany({
        where: {
          providerId: provider.id,
          isActive: true,
        },
        orderBy: [
          { consecutiveFails: "asc" },
          { priority: "asc" },
        ],
      });

      // Filter out keys on cooldown and already tried
      const availableKeys: ProviderCredential[] = [];
      for (const k of keys) {
        if (triedCredentials.has(k.id)) continue;
        if (k.cooldownUntil && k.cooldownUntil > new Date()) continue;

        try {
          availableKeys.push({
            keyId: k.id,
            providerId: k.providerId,
            label: k.label,
            decryptedKey: decrypt(k.encryptedKey),
            priority: k.priority,
            consecutiveFails: k.consecutiveFails,
            cooldownUntil: k.cooldownUntil,
            quotaRemaining: k.quotaRemaining ? Number(k.quotaRemaining) : null,
          });
        } catch {
          // Skip keys with decryption errors
          continue;
        }
      }

      if (availableKeys.length === 0) {
        continue;
      }

      // 6. Select best credential using Fill-First strategy
      const credential = this.fillFirstSelect(availableKeys);
      if (!credential) continue;

      return {
        target: {
          provider: {
            id: provider.id,
            name: provider.name,
            slug: provider.slug,
            baseUrl: provider.baseUrl,
            apiKeyHeader: provider.apiKeyHeader,
            apiKeyPrefix: provider.apiKeyPrefix,
            status: provider.status,
            priority: provider.priority,
          },
          model,
          poolPriority: entry.priority,
          poolWeight: entry.weight,
        },
        credential,
        fallbackChain,
      };
    }

    throw new RoutingError(
      "ALL_PROVIDERS_FAILED",
      `All providers failed for model: ${requestModel}. Chain: ${fallbackChain.join(" → ")}`
    );
  }

  static async markKeySuccess(keyId: string): Promise<void> {
    if (keyId.startsWith("noauth-")) return;
    await prisma.providerKey.update({
      where: { id: keyId },
      data: { consecutiveFails: 0, cooldownUntil: null },
    });
  }

  static async markKeyFailure(keyId: string, errorMsg: string): Promise<void> {
    // Skip synthetic no-auth keys
    if (keyId.startsWith("noauth-")) return;
    const key = await prisma.providerKey.findUnique({ where: { id: keyId } });
    if (!key) return;

    const newFails = key.consecutiveFails + 1;
    const cooldownMs =
      key.consecutiveFails >= 5 ? 300_000 : // 5 min after 5 fails
        key.consecutiveFails >= 3 ? 120_000 : // 2 min after 3 fails
          30_000; // 30s otherwise

    await prisma.providerKey.update({
      where: { id: keyId },
      data: {
        consecutiveFails: newFails,
        lastErrorAt: new Date(),
        lastErrorMsg: errorMsg,
        cooldownUntil: new Date(Date.now() + cooldownMs),
        isActive: newFails >= 10 ? false : key.isActive, // Auto-disable after 10 consecutive
      },
    });
  }
}

export class RoutingError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 502
  ) {
    super(message);
    this.name = "RoutingError";
  }
}
