import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      stripeConnectId: true,
      stripeConnectVerified: true,
      walletBalance: true,
      payouts: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          amount: true,
          status: true,
          stripePayoutId: true,
          processedAt: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    stripeConnectId: user.stripeConnectId,
    stripeConnectVerified: user.stripeConnectVerified,
    walletBalance: user.walletBalance,
    recentPayouts: user.payouts.map((p) => ({
      id: p.id,
      amount: p.amount,
      status: p.status,
      stripePayoutId: p.stripePayoutId,
      processedAt: p.processedAt?.toISOString() ?? null,
      createdAt: p.createdAt.toISOString(),
    })),
  });
}

export async function POST() {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      walletBalance: true,
      stripeConnectVerified: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!user.stripeConnectVerified) {
    return NextResponse.json(
      { error: "Stripe Connect must be set up first" },
      { status: 400 }
    );
  }

  if (user.walletBalance < 20) {
    return NextResponse.json(
      { error: "Minimum payout is $20.00" },
      { status: 400 }
    );
  }

  const amountCents = Math.floor(user.walletBalance * 100);

  const payout = await prisma.payout.create({
    data: {
      userId: session.userId,
      amount: amountCents,
      status: "PENDING",
    },
  });

  await prisma.user.update({
    where: { id: session.userId },
    data: { walletBalance: 0 },
  });

  return NextResponse.json({
    message: "Payout requested successfully",
    payout: {
      id: payout.id,
      amount: payout.amount,
      status: payout.status,
    },
  });
}
