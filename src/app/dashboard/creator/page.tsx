import { verifySession } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CreatorDashboardClient } from "./CreatorDashboardClient";

interface ChartBar {
  label: string;
  revenue: number;
  height: number;
}

export default async function CreatorDashboardPage() {
  const session = await verifySession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      totalEarnings: true,
      walletBalance: true,
      skills: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect("/login");

  const skillsCount = user.skills.length;
  const totalDownloads = user.skills.reduce(
    (sum, s) => sum + s.downloads,
    0
  );

  const skillIds = user.skills.map((s) => s.id);

  const transactions = await prisma.transaction.findMany({
    where: {
      skillId: { in: skillIds },
      status: "COMPLETED",
    },
    select: {
      amountNet: true,
      createdAt: true,
      skillId: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const lastSixMonths: { month: string; revenue: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    lastSixMonths.push({ month: key, revenue: 0 });
  }

  for (const tx of transactions) {
    const d = new Date(tx.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const entry = lastSixMonths.find((m) => m.month === key);
    if (entry) {
      entry.revenue += tx.amountNet;
    }
  }

  const maxRevenue = Math.max(...lastSixMonths.map((m) => m.revenue), 1);

  const monthLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const chartData: ChartBar[] = lastSixMonths.map((m) => {
    const monthIdx = Number(m.month.split("-")[1] ?? "1") - 1;
    const label = monthLabels[monthIdx] ?? "Jan";
    return {
      label,
      revenue: m.revenue,
      height: Math.max((m.revenue / maxRevenue) * 120, 2),
    };
  });

  const skillsWithRevenue = user.skills.map((skill) => {
    const revenue = transactions
      .filter((t) => t.skillId === skill.id)
      .reduce((sum, t) => sum + t.amountNet, 0);
    return {
      id: skill.id,
      title: skill.title,
      status: skill.status,
      downloads: skill.downloads,
      revenue,
    };
  });

  return (
    <CreatorDashboardClient
      totalEarnings={user.totalEarnings}
      walletBalance={user.walletBalance}
      skillsCount={skillsCount}
      totalDownloads={totalDownloads}
      chartData={chartData}
      skills={skillsWithRevenue}
    />
  );
}
