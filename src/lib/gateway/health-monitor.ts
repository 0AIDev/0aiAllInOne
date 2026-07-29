// ============================================================
// AI0FY — WebSocket Live Monitor
// Real-time provider health streaming for admin dashboard
// ============================================================

import { prisma } from "@/lib/prisma";

interface HealthSnapshot {
  providers: Array<{
    id: string;
    name: string;
    slug: string;
    status: string;
    latencyMs: number;
    errorRate: number;
    successRate: number;
    consecutiveFails: number;
    activeKeys: number;
    totalKeys: number;
  }>;
  timestamp: number;
}

export class HealthMonitor {
  /**
   * Take a health snapshot of all providers.
   * Can be called from a WebSocket connection or a cron job.
   */
  static async snapshot(): Promise<HealthSnapshot> {
    const providers = await prisma.provider.findMany({
      include: {
        keys: { select: { isActive: true } },
        healthChecks: {
          orderBy: { lastCheckedAt: "desc" },
          take: 1,
        },
      },
    });

    return {
      timestamp: Date.now(),
      providers: providers.map((p) => {
        const health = p.healthChecks[0];
        const activeKeys = p.keys.filter((k) => k.isActive).length;
        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          status: p.status,
          latencyMs: health?.latencyMs ?? 0,
          errorRate: health?.errorRate ?? 0,
          successRate: health?.successRate ?? 100,
          consecutiveFails: health?.consecutiveFails ?? 0,
          activeKeys,
          totalKeys: p.keys.length,
        };
      }),
    };
  }

  /**
   * Stream health updates via Server-Sent Events.
   * Use in an API route: new ReadableStream + this generator.
   */
  static async *streamSnapshots(intervalMs = 3000) {
    while (true) {
      try {
        const snapshot = await HealthMonitor.snapshot();
        yield `data: ${JSON.stringify(snapshot)}\n\n`;
      } catch {
        yield `data: ${JSON.stringify({ error: "Health check failed" })}\n\n`;
      }
      await sleep(intervalMs);
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
