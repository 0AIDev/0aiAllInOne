import { prisma } from "@/lib/prisma";
import { withRedis } from "@/lib/redis";
import type { PlanTier } from "@prisma/client";

interface QuotaCheckResult {
  allowed: boolean;
  reason?: string;
  remainingTokens: number;
  usedTokens: number;
  hardLimit: number;
  softLimit: number;
  isHardQuota: boolean;
}

const PLAN_LIMITS: Record<PlanTier, { tokensPerMonth: number; requestsPerMin: number }> = {
  FREE: { tokensPerMonth: 100_000, requestsPerMin: 60 },
  STARTER: { tokensPerMonth: 5_000_000, requestsPerMin: 200 },
  PRO: { tokensPerMonth: 20_000_000, requestsPerMin: 500 },
  BUSINESS: { tokensPerMonth: 100_000_000, requestsPerMin: 2000 },
  ENTERPRISE: { tokensPerMonth: 500_000_000, requestsPerMin: 10000 },
};

export class QuotaManager {
  /**
   * Check if a tenant can make a request, respecting soft and hard quotas.
   */
  static async checkQuota(tenantId: string): Promise<QuotaCheckResult> {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        planTier: true,
        hardQuotaTokens: true,
        softQuotaTokens: true,
        tokensUsedThisMonth: true,
        quotaResetAt: true,
      },
    });

    if (!tenant) {
      return {
        allowed: false,
        reason: "Tenant not found",
        remainingTokens: 0,
        usedTokens: 0,
        hardLimit: 0,
        softLimit: 0,
        isHardQuota: true,
      };
    }

    // Reset monthly quota if needed
    const now = new Date();
    let usedTokens = tenant.tokensUsedThisMonth;
    if (now >= tenant.quotaResetAt) {
      usedTokens = 0;
      const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      await prisma.tenant.update({
        where: { id: tenantId },
        data: { tokensUsedThisMonth: 0, quotaResetAt: nextReset },
      });
    }

    const planLimits = PLAN_LIMITS[tenant.planTier];
    const hardLimit = tenant.hardQuotaTokens || planLimits.tokensPerMonth;
    const softLimit = tenant.softQuotaTokens || Math.round(hardLimit * 0.85);

    if (usedTokens >= hardLimit) {
      return {
        allowed: false,
        reason: `Hard quota exceeded: ${usedTokens}/${hardLimit} tokens used this month`,
        remainingTokens: 0,
        usedTokens,
        hardLimit,
        softLimit,
        isHardQuota: true,
      };
    }

    if (usedTokens >= softLimit) {
      return {
        allowed: true,
        reason: `Soft quota warning: ${usedTokens}/${softLimit} tokens (hard limit: ${hardLimit})`,
        remainingTokens: hardLimit - usedTokens,
        usedTokens,
        hardLimit,
        softLimit,
        isHardQuota: false,
      };
    }

    return {
      allowed: true,
      remainingTokens: hardLimit - usedTokens,
      usedTokens,
      hardLimit,
      softLimit,
      isHardQuota: false,
    };
  }

  /**
   * Check RPM (requests per minute) limit with Redis sliding window.
   */
  static async checkRateLimit(
    tenantId: string,
    apiKeyId?: string
  ): Promise<{ allowed: boolean; retryAfter?: number }> {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { planTier: true },
    });
    if (!tenant) return { allowed: false };

    const planLimits = PLAN_LIMITS[tenant.planTier];
    const rpmLimit = planLimits.requestsPerMin;

    // Check API key specific limits
    let keyRpmLimit = rpmLimit;
    if (apiKeyId) {
      const apiKey = await prisma.apiKey.findUnique({
        where: { id: apiKeyId },
        select: { rpmLimit: true },
      });
      if (apiKey) {
        keyRpmLimit = Math.min(rpmLimit, apiKey.rpmLimit);
      }
    }

    return withRedis(
      async (redis) => {
        const now = Date.now();
        const windowKey = `ratelimit:${tenantId}:${now - (now % 60000)}`;
        const current = await redis.incr(windowKey);
        if (current === 1) {
          await redis.expire(windowKey, 60);
        }
        if (current > keyRpmLimit) {
          return { allowed: false, retryAfter: 60 };
        }
        return { allowed: true };
      },
      { allowed: true } // Fail-open if Redis is down
    );
  }

  /**
   * Track token usage after a successful request.
   */
  static async trackUsage(params: {
    tenantId: string;
    apiKeyId?: string;
    providerId?: string;
    modelId?: string;
    requestModel?: string;
    tokensInput: number;
    tokensOutput: number;
    tokensCacheHit?: number;
    cost: number;
    latencyMs?: number;
    ttftMs?: number;
    compressionRatio?: number;
    fallbackUsed?: boolean;
    fallbackChain?: string;
    status?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    await prisma.tenant.update({
      where: { id: params.tenantId },
      data: {
        tokensUsedThisMonth: {
          increment: params.tokensInput + params.tokensOutput,
        },
      },
    });

    await prisma.usageRecord.create({
      data: {
        tenantId: params.tenantId,
        apiKeyId: params.apiKeyId,
        providerId: params.providerId,
        modelId: params.modelId ?? "tracked",
        requestModel: params.requestModel ?? "tracked",
        tokensInput: params.tokensInput,
        tokensOutput: params.tokensOutput,
        tokensCacheHit: params.tokensCacheHit ?? 0,
        cost: params.cost,
        latencyMs: params.latencyMs ?? 0,
        ttftMs: params.ttftMs ?? 0,
        compressionRatio: params.compressionRatio ?? 0,
        fallbackUsed: params.fallbackUsed ?? false,
        fallbackChain: params.fallbackChain ?? "[]",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        status: (params.status as any) ?? "SUCCESS",
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    });
  }
}
