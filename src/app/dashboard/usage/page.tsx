import { verifySession } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UsageChart } from "./UsageChart";

export default async function UsagePage() {
  const session = await verifySession();
  if (!session) redirect("/login");

  const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const records = await prisma.usageRecord.findMany({
    where: {
      tenantId: session.tenantId,
      createdAt: { gte: last30Days },
    },
    orderBy: { createdAt: "asc" },
    select: {
      tokensInput: true,
      tokensOutput: true,
      cost: true,
      modelId: true,
      createdAt: true,
      status: true,
    },
  });

  const dailyUsage = new Map<string, { tokens: number; cost: number; requests: number }>();
  for (const r of records) {
    const day = r.createdAt.toISOString().slice(0, 10);
    const existing = dailyUsage.get(day) ?? { tokens: 0, cost: 0, requests: 0 };
    existing.tokens += r.tokensInput + r.tokensOutput;
    existing.cost += r.cost;
    existing.requests += 1;
    dailyUsage.set(day, existing);
  }

  const chartData = Array.from(dailyUsage.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => ({
      date,
      tokens: data.tokens,
      cost: Math.round(data.cost * 100) / 100,
      requests: data.requests,
    }));

  const totalTokens = records.reduce((s, r) => s + r.tokensInput + r.tokensOutput, 0);
  const totalCost = records.reduce((s, r) => s + r.cost, 0);
  const totalRequests = records.length;

  return (
    <div className="p-6" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
      <h1 className="text-2xl font-bold text-[#0F0F0E]">Usage</h1>
      <p className="mt-1 text-sm text-[#7A7870]">Last 30 days</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Tokens" value={totalTokens.toLocaleString()} />
        <StatCard title="Total Requests" value={totalRequests.toLocaleString()} />
        <StatCard
          title="Total Cost"
          value={`$${totalCost.toFixed(2)}`}
        />
      </div>

      <div className="mt-6 rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6">
        <UsageChart data={chartData} />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-5">
      <p className="text-sm font-medium text-[#7A7870]">{title}</p>
      <p className="mt-2 text-2xl font-bold text-[#0F0F0E]">{value}</p>
    </div>
  );
}
