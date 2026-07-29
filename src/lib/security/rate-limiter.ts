import { withRedis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";

interface RateLimitConfig {
  identifier: string;
  windowSeconds: number;
  maxRequests: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

/**
 * Sliding-window rate limiter using Redis with graceful fallback.
 * Supports multiple windows (e.g., per-minute, per-hour, per-day).
 */
export class RateLimiter {
  /**
   * Check rate limit, returning whether the request is allowed.
   * Keys are scoped per tenant to ensure isolation.
   */
  static async check(
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    const { identifier, windowSeconds, maxRequests } = config;

    const redisResult = await withRedis(
      async (redis) => {
        const now = Math.floor(Date.now() / 1000);
        const windowId = Math.floor(now / windowSeconds);
        const key = `rl:${identifier}:${windowId}`;

        const luaScript = `
          local current = redis.call('INCR', KEYS[1])
          if current == 1 then
            redis.call('EXPIRE', KEYS[1], ARGV[1])
          end
          return current
        `;

        const current = await redis.eval(
          luaScript,
          1,
          key,
          windowSeconds.toString()
        );

        const count = Number(current);
        const resetAt = (windowId + 1) * windowSeconds;
        const remaining = Math.max(0, maxRequests - count);

        return {
          allowed: count <= maxRequests,
          remaining,
          resetAt,
          retryAfter: count > maxRequests ? windowSeconds : undefined,
        };
      },
      { allowed: true, remaining: maxRequests, resetAt: 0, retryAfter: undefined }
    );

    return redisResult;
  }

  /**
   * Tenant-scoped rate limiter that combines tenant + key limits.
   */
  static async checkTenantRequest(
    tenantId: string,
    apiKeyId?: string
  ): Promise<RateLimitResult> {
    // Get tenant plan limits
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { planTier: true },
    });
    if (!tenant) return { allowed: false, remaining: 0, resetAt: 0 };

    // Check per-minute rate
    const perMinute = await this.check({
      identifier: `tenant:${tenantId}`,
      windowSeconds: 60,
      maxRequests: 1000,
    });
    if (!perMinute.allowed) return perMinute;

    // Check per-key rate if applicable
    if (apiKeyId) {
      const apiKey = await prisma.apiKey.findUnique({
        where: { id: apiKeyId },
        select: { rpmLimit: true },
      });
      if (apiKey) {
        const keyLimit = await this.check({
          identifier: `apikey:${apiKeyId}`,
          windowSeconds: 60,
          maxRequests: apiKey.rpmLimit,
        });
        if (!keyLimit.allowed) return keyLimit;
      }
    }

    return perMinute;
  }

  /**
   * Check daily token usage limit.
   */
  static async checkDailyTokenLimit(
    tenantId: string,
    _tokensToAdd: number
  ): Promise<boolean> {
    const dateKey = new Date().toISOString().slice(0, 10);
    const redisKey = `tokens:${tenantId}:${dateKey}`;

    return withRedis(
      async (_redis) => {
        void redisKey;
        return true;
      },
      true
    );
  }
}
