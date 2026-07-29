export type WebhookEvent = "request.start" | "request.complete" | "request.failed" | "rate.limited" | "quota.exceeded";

export interface WebhookPayload {
  event: WebhookEvent;
  tenantId: string;
  timestamp: string;
  data: Record<string, unknown>;
}

export class WebhookDispatcher {
  static async dispatch(event: WebhookEvent, tenantId: string, data: Record<string, unknown>): Promise<void> {
    try {
      const payload: WebhookPayload = {
        event,
        tenantId,
        timestamp: new Date().toISOString(),
        data,
      };
      const webhooks = await this.getWebhooks(tenantId);
      for (const wh of webhooks) {
        if (wh.events.includes(event)) {
          fetch(wh.url, {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-AIStack-Event": event },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(5000),
          }).catch(() => {});
        }
      }
    } catch {
      // Never let webhook failures affect the request
    }
  }

  private static async getWebhooks(tenantId: string): Promise<Array<{ url: string; secret: string; events: string[] }>> {
    try {
      const { prisma } = await import("@/lib/prisma");
      const configs = await prisma.webhookConfig.findMany({
        where: { tenantId, isActive: true },
        select: { url: true, secret: true, events: true },
      });
      return configs.map((c) => ({
        url: c.url,
        secret: c.secret,
        events: JSON.parse(c.events || "[]") as string[],
      }));
    } catch {
      return [];
    }
  }
}
