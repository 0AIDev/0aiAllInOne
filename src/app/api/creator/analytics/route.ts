import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.userId;

  const [user, skillsCount, totalDownloads, monthlyRevenue] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { totalEarnings: true, walletBalance: true },
    }),
    prisma.skill.count({ where: { creatorId: userId } }),
    prisma.skill.aggregate({
      where: { creatorId: userId },
      _sum: { downloads: true },
    }),
    prisma.transaction.groupBy({
      by: ["createdAt"],
      where: {
        skill: { creatorId: userId },
        status: "COMPLETED",
        createdAt: {
          gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        },
      },
      _sum: { amountNet: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const monthlyMap = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap.set(key, 0);
  }

  for (const row of monthlyRevenue) {
    const d = new Date(row.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (monthlyMap.has(key)) {
      monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + (row._sum.amountNet ?? 0));
    }
  }

  const revenue = Array.from(monthlyMap.entries()).map(([month, amount]) => ({
    month,
    amount: amount / 100,
  }));

  return NextResponse.json({
    totalEarnings: user?.totalEarnings ?? 0,
    walletBalance: user?.walletBalance ?? 0,
    skillsCount,
    totalDownloads: totalDownloads._sum.downloads ?? 0,
    monthlyRevenue: revenue,
  });
}
