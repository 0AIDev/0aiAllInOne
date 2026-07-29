import Redis from "ioredis";

const globalForRedis = globalThis as unknown as { redis: Redis | undefined };

function createRedisClient(): Redis | null {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  return new Redis(url, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 3) return null;
      return Math.min(times * 200, 2000);
    },
    lazyConnect: true,
    enableOfflineQueue: false,
  });
}

export const redis = globalForRedis.redis ?? createRedisClient();
if (redis && !globalForRedis.redis) globalForRedis.redis = redis;

export async function getRedis(): Promise<Redis | null> {
  if (!redis) return null;
  if (redis.status === "wait") await redis.connect();
  if (redis.status !== "ready") return null;
  return redis;
}

export async function withRedis<T>(
  fn: (r: Redis) => Promise<T>,
  fallback: T
): Promise<T> {
  const r = await getRedis();
  if (!r) return fallback;
  try {
    return await fn(r);
  } catch {
    return fallback;
  }
}
