import { verifySession } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const strategyBadgeClasses: Record<string, string> = {
  PRIORITY: "bg-[#0F0F0E] text-white",
  FALLBACK: "bg-[#FEF3C7] text-[#B45309]",
  ROUND_ROBIN: "bg-[#DBEAFE] text-[#1E40AF]",
  WEIGHTED: "bg-[#F3E8FF] text-[#7E22CE]",
  LOWEST_LATENCY: "bg-[#DCFCE7] text-[#15803D]",
};

const fallbackStrategyClasses = "bg-[rgba(15,15,14,0.06)] text-[#0F0F0E]";

export default async function AdminRoutingPage() {
  const session = await verifySession();
  if (!session || session.role === "MEMBER") redirect("/login");

  const routeRules = await prisma.routeRule.findMany({
    orderBy: { priority: "asc" },
  });

  return (
    <div className="min-h-screen bg-[#F9F9F6] p-6">
      <h1 className="text-2xl font-bold text-[#0F0F0E]">Route Rules</h1>
      <p className="mt-1 text-sm text-[#7A7870]">
        Configure AI model routing and fallback chains
      </p>

      <div className="mt-6 rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F1EFE9]">
              <th className="px-4 py-3 text-left font-medium text-[#3A3A37] rounded-tl-[14px]">Name</th>
              <th className="px-4 py-3 text-left font-medium text-[#3A3A37]">Match Model</th>
              <th className="px-4 py-3 text-left font-medium text-[#3A3A37]">Strategy</th>
              <th className="px-4 py-3 text-left font-medium text-[#3A3A37]">Target Chain</th>
              <th className="px-4 py-3 text-left font-medium text-[#3A3A37]">Priority</th>
              <th className="px-4 py-3 text-left font-medium text-[#3A3A37] rounded-tr-[14px]">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(15,15,14,0.08)]">
            {routeRules.map((rule) => {
              const chain = JSON.parse(rule.targetChain || "[]") as string[];
              const stratClasses = strategyBadgeClasses[rule.strategy] ?? fallbackStrategyClasses;
              const activeClasses = rule.isActive
                ? "bg-[#DCFCE7] text-[#15803D]"
                : "bg-[rgba(15,15,14,0.06)] text-[#7A7870]";
              return (
                <tr key={rule.id}>
                  <td className="px-4 py-3 font-medium text-[#0F0F0E]">{rule.name}</td>
                  <td className="px-4 py-3 text-xs text-[#3A3A37]">
                    {rule.matchModel}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${stratClasses}`}>
                      {rule.strategy}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(chain) &&
                        chain.map((c, i) => (
                          <span
                            key={i}
                            className="inline-flex rounded px-1.5 py-0.5 text-xs bg-[rgba(15,15,14,0.06)] text-[#3A3A37]"
                          >
                            {c}
                            {i < chain.length - 1 && " →"}
                          </span>
                        ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#7A7870]">{rule.priority}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${activeClasses}`}>
                      {rule.isActive ? "Yes" : "No"}
                    </span>
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
