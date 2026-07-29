import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { planTier } = await request.json();
  if (!planTier) return NextResponse.json({ error: "Missing planTier" }, { status: 400 });

  const plan = await prisma.plan.findUnique({ where: { tier: planTier } });
  if (!plan) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  await prisma.tenant.update({
    where: { id: session.tenantId },
    data: { planTier },
  });

  return NextResponse.json({ success: true });
}
