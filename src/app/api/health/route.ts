import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRedis } from "@/lib/redis";

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  uptime: number;
  version: string;
  checks: Record<string, { status: string; latency?: number; error?: string }>;
}

export async function GET(): Promise<NextResponse> {
  const checks: HealthStatus["checks"] = {};
  let overallStatus: HealthStatus["status"] = "healthy";

  // Database check
  const dbStart = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = { status: "healthy", latency: Date.now() - dbStart };
  } catch (err) {
    checks.database = { status: "unhealthy", latency: Date.now() - dbStart, error: (err as Error).message };
    overallStatus = "unhealthy";
  }

  // Redis check (optional)
  const redisStart = Date.now();
  try {
    const r = await getRedis();
    if (r) {
      await r.ping();
      checks.redis = { status: "healthy", latency: Date.now() - redisStart };
    } else {
      checks.redis = { status: "not_configured" };
    }
  } catch (err) {
    checks.redis = { status: "degraded", latency: Date.now() - redisStart, error: (err as Error).message };
    if (overallStatus !== "unhealthy") overallStatus = "degraded";
  }

  // Memory check
  const memUsage = process.memoryUsage();
  checks.memory = {
    status: memUsage.heapUsed / memUsage.heapTotal > 0.9 ? "degraded" : "healthy",
  };

  const health: HealthStatus = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    version: process.env.APP_VERSION ?? "0.1.0",
    checks,
  };

  const statusCode = overallStatus === "unhealthy" ? 503 : overallStatus === "degraded" ? 200 : 200;

  return NextResponse.json(health, {
    status: statusCode,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "X-Health-Status": overallStatus,
    },
  });
}
