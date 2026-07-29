// ============================================================
// AI0FY — Audit Logger (OmniRoute audit_logs)
// Traces key actions: login, key create/revoke, gateway requests
// ============================================================

import { prisma } from "@/lib/prisma";

type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "REGISTER"
  | "API_KEY_CREATED"
  | "API_KEY_REVOKED"
  | "GATEWAY_REQUEST"
  | "GATEWAY_ERROR"
  | "PROVIDER_KEY_ADDED"
  | "PROVIDER_KEY_REMOVED"
  | "PROVIDER_KEY_TOGGLED"
  | "PLAN_CHANGED"
  | "SUBSCRIPTION_UPDATED"
  | "QUOTA_EXCEEDED"
  | "RATE_LIMITED"
  | "GUARDRAIL_TRIGGERED";

interface AuditEntry {
  tenantId: string;
  userId?: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}

export class AuditLogger {
  static async log(entry: AuditEntry): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          tenantId: entry.tenantId,
          userId: entry.userId,
          action: entry.action,
          resource: entry.resource,
          resourceId: entry.resourceId,
          details: JSON.stringify(entry.details ?? {}),
          ipAddress: entry.ipAddress,
        },
      });
    } catch {
      // Never fail the request because of audit logging
    }
  }

  static async getRecentActions(tenantId: string, limit = 50) {
    return prisma.auditLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
