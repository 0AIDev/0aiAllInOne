import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const firstOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  // Reset quotas for tenants whose reset date has passed
  const result = await prisma.tenant.updateMany({
    where: {
      quotaResetAt: { lte: now },
    },
    data: {
      tokensUsedThisMonth: 0,
      quotaResetAt: firstOfNextMonth,
    },
  });

  return NextResponse.json({
    success: true,
    tenantsReset: result.count,
    nextResetAt: firstOfNextMonth.toISOString(),
  });
}
