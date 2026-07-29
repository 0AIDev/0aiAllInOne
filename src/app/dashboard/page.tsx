import { verifySession } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils/cn";

export default async function DashboardPage() {
  const session = await verifySession();
  if (!session) redirect("/login");

  const [tenant, apiKeyCount, usageThisMonth] = await Promise.all([
    prisma.tenant.findUnique({
      where: { id: session.tenantId },
      include: { subscription: true },
    }),
    prisma.apiKey.count({ where: { tenantId: session.tenantId } }),
    prisma.usageRecord.aggregate({
      where: { tenantId: session.tenantId },
      _sum: { tokensInput: true, tokensOutput: true, cost: true },
    }),
  ]);

  if (!tenant) redirect("/login");

  const totalTokens =
    (usageThisMonth._sum.tokensInput ?? 0) + (usageThisMonth._sum.tokensOutput ?? 0);
  const hardLimit = tenant.hardQuotaTokens;
  const usagePercent = hardLimit > 0 ? Math.round((totalTokens / hardLimit) * 100) : 0;
  const cost = usageThisMonth._sum.cost ?? 0;

  const progressBarColor =
    usagePercent > 90
      ? "bg-red-500"
      : usagePercent > 70
        ? "bg-amber-500"
        : "bg-emerald-500";

  const progressTextColor =
    usagePercent > 90
      ? "text-red-600"
      : usagePercent > 70
        ? "text-amber-600"
        : "text-emerald-600";

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-['Inter_Tight'] text-[28px] font-semibold leading-tight tracking-tight text-[#0F0F0E]">
          Welcome back{tenant.name ? `, ${tenant.name}` : ""}
        </h1>
        <p className="mt-1 font-['Inter_Tight'] text-sm text-[#7A7870]">
          {tenant.planTier} Plan
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          className="rounded-[14px] border bg-white p-5"
          style={{ borderColor: "rgba(15,15,14,0.08)" }}
        >
          <p className="font-['Inter_Tight'] text-sm font-medium text-[#7A7870]">
            Tokens Used
          </p>
          <p className="mt-2 font-['Inter_Tight'] text-2xl font-semibold text-[#0F0F0E]">
            {totalTokens.toLocaleString()}
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[rgba(15,15,14,0.06)]">
            <div
              className={cn("h-full rounded-full transition-all", progressBarColor)}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
          <p
            className={cn(
              "mt-2 font-['Inter_Tight'] text-xs",
              progressTextColor
            )}
          >
            {usagePercent}% of {hardLimit.toLocaleString()} limit
          </p>
        </div>

        <div
          className="rounded-[14px] border bg-white p-5"
          style={{ borderColor: "rgba(15,15,14,0.08)" }}
        >
          <p className="font-['Inter_Tight'] text-sm font-medium text-[#7A7870]">
            API Keys
          </p>
          <p className="mt-2 font-['Inter_Tight'] text-2xl font-semibold text-[#0F0F0E]">
            {apiKeyCount}
          </p>
          <p className="mt-1 font-['Inter_Tight'] text-xs text-[#7A7870]">
            Active keys
          </p>
        </div>

        <div
          className="rounded-[14px] border bg-white p-5"
          style={{ borderColor: "rgba(15,15,14,0.08)" }}
        >
          <p className="font-['Inter_Tight'] text-sm font-medium text-[#7A7870]">
            Plan
          </p>
          <p className="mt-2 font-['Inter_Tight'] text-2xl font-semibold text-[#0F0F0E]">
            {tenant.planTier}
          </p>
          <p className="mt-1 font-['Inter_Tight'] text-xs text-[#7A7870]">
            {tenant.subscription?.status ?? "N/A"}
          </p>
        </div>

        <div
          className="rounded-[14px] border bg-white p-5"
          style={{ borderColor: "rgba(15,15,14,0.08)" }}
        >
          <p className="font-['Inter_Tight'] text-sm font-medium text-[#7A7870]">
            Cost
          </p>
          <p className="mt-2 font-['Inter_Tight'] text-2xl font-semibold text-[#0F0F0E]">
            ${cost.toFixed(2)}
          </p>
          <p className="mt-1 font-['Inter_Tight'] text-xs text-[#7A7870]">
            This month
          </p>
        </div>
      </div>
    </div>
  );
}
