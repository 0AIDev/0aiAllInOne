import { verifySession } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
  const session = await verifySession();
  if (!session || session.role === "MEMBER") redirect("/login");

  const [tenantCount, userCount, providerCount, planCounts] = await Promise.all([
    prisma.tenant.count(),
    prisma.user.count(),
    prisma.provider.count(),
    prisma.tenant.groupBy({
      by: ["planTier"],
      _count: true,
    }),
  ]);

  const planDistribution = Object.fromEntries(
    planCounts.map((p) => [p.planTier, p._count])
  );

  return (
    <div className="min-h-screen bg-[#F9F9F6] p-6">
      <h1 className="text-2xl font-bold text-[#0F0F0E]">
        Admin
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Tenants" value={tenantCount.toString()} />
        <StatCard title="Users" value={userCount.toString()} />
        <StatCard title="Providers" value={providerCount.toString()} />
        <StatCard title="Free Plan" value={(planDistribution["FREE"] ?? 0).toString()} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6">
          <h2 className="text-sm font-semibold text-[#0F0F0E]">
            Plan Distribution
          </h2>
          <div className="mt-4 space-y-3">
            {(["FREE", "STARTER", "PRO", "BUSINESS", "ENTERPRISE"] as const).map((tier) => {
              const count = planDistribution[tier] ?? 0;
              const max = Math.max(...Object.values(planDistribution), 1);
              const pct = Math.round((count / max) * 100);
              return (
                <div key={tier} className="flex items-center gap-3">
                  <span className="w-20 text-sm text-[#3A3A37]">
                    {tier}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-[rgba(15,15,14,0.06)]">
                    <div
                      className="h-2 rounded-full bg-[#0F0F0E]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-6 text-right text-[#0F0F0E]">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6">
          <h2 className="text-sm font-semibold text-[#0F0F0E]">
            Quick Actions
          </h2>
          <div className="mt-4 space-y-1">
            <Link
              href="/admin/providers"
              className="block px-4 py-2 text-sm text-[#0F0F0E] underline decoration-1 underline-offset-4 hover:no-underline"
            >
              Manage Provider Keys
            </Link>
            <Link
              href="/admin/routing"
              className="block px-4 py-2 text-sm text-[#0F0F0E] underline decoration-1 underline-offset-4 hover:no-underline"
            >
              Configure Routing Rules
            </Link>
            <Link
              href="/admin/revenue"
              className="block px-4 py-2 text-sm text-[#0F0F0E] underline decoration-1 underline-offset-4 hover:no-underline"
            >
              View Revenue
            </Link>
            <Link
              href="/admin/users"
              className="block px-4 py-2 text-sm text-[#0F0F0E] underline decoration-1 underline-offset-4 hover:no-underline"
            >
              View Users
            </Link>
          </div>
        </div>
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
