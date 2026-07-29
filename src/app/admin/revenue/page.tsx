import { verifySession } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const planBadgeClasses: Record<string, string> = {
  FREE: "bg-[rgba(15,15,14,0.06)] text-[#3A3A37]",
  STARTER: "bg-[#DBEAFE] text-[#1E40AF]",
  PRO: "bg-[#E0E7FF] text-[#4338CA]",
  BUSINESS: "bg-[#F3E8FF] text-[#7E22CE]",
  ENTERPRISE: "bg-[#0F0F0E] text-white",
};

const subscriptionBadgeClasses: Record<string, string> = {
  ACTIVE: "bg-[#DCFCE7] text-[#15803D]",
};

export default async function AdminRevenuePage() {
  const session = await verifySession();
  if (!session || session.role === "MEMBER") redirect("/login");

  const tenants = await prisma.tenant.findMany({
    include: {
      subscription: true,
      _count: { select: { apiKeys: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalMrr =
    tenants.filter((t) => t.subscription?.status === "ACTIVE").length * 29;

  const totalTenants = tenants.length;
  const payingTenants = tenants.filter(
    (t) => t.subscription?.status === "ACTIVE"
  ).length;

  return (
    <div className="min-h-screen bg-[#F9F9F6] p-6">
      <h1 className="text-2xl font-bold text-[#0F0F0E]">
        Revenue &amp; Analytics
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard title="Total MRR" value={`$${totalMrr.toLocaleString()}`} />
        <StatCard title="Tenants" value={totalTenants.toString()} subtitle={`${payingTenants} paying`} />
        <StatCard
          title="Conversion"
          value={`${totalTenants > 0 ? Math.round((payingTenants / totalTenants) * 100) : 0}%`}
        />
      </div>

      <div className="mt-8 rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F1EFE9]">
              <th className="px-4 py-3 text-left font-medium text-[#3A3A37] rounded-tl-[14px]">
                Name
              </th>
              <th className="px-4 py-3 text-left font-medium text-[#3A3A37]">Plan</th>
              <th className="px-4 py-3 text-left font-medium text-[#3A3A37]">Status</th>
              <th className="px-4 py-3 text-right font-medium text-[#3A3A37]">API Keys</th>
              <th className="px-4 py-3 text-right font-medium text-[#3A3A37] rounded-tr-[14px]">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(15,15,14,0.08)]">
            {tenants.map((t) => {
              const planClasses = planBadgeClasses[t.planTier] ?? planBadgeClasses.FREE;
              const subStatus = t.subscription?.status;
              const subClasses = subStatus && subscriptionBadgeClasses[subStatus]
                ? subscriptionBadgeClasses[subStatus]
                : "bg-[rgba(15,15,14,0.06)] text-[#3A3A37]";
              return (
                <tr key={t.id}>
                  <td className="px-4 py-3 font-medium text-[#0F0F0E]">{t.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${planClasses}`}>
                      {t.planTier}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${subClasses}`}>
                      {t.subscription?.status ?? "FREE"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-[#7A7870]">{t._count.apiKeys}</td>
                  <td className="px-4 py-3 text-right text-[#7A7870]">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) {
  return (
    <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-5">
      <p className="text-sm font-medium text-[#7A7870]">{title}</p>
      <p className="mt-2 text-2xl font-bold text-[#0F0F0E]">{value}</p>
      {subtitle && (
        <p className="mt-1 text-xs text-[#7A7870]">{subtitle}</p>
      )}
    </div>
  );
}
