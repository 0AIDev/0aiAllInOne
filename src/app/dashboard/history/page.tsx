import { verifySession } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function StatusBadge({ status }: { status: string }) {
  const baseClasses = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium";
  if (status === "SUCCESS") {
    return (
      <span className={`${baseClasses} bg-[#E8F5E9] text-[#2E7D32]`}>
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2E7D32]" />
        Success
      </span>
    );
  }
  if (status === "FALLBACK") {
    return (
      <span className={`${baseClasses} bg-[#FFF8E1] text-[#F57F17]`}>
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#F57F17]" />
        Fallback
      </span>
    );
  }
  return (
    <span className={`${baseClasses} bg-[#FFEBEE] text-[#C62828]`}>
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#C62828]" />
      {status}
    </span>
  );
}

export default async function HistoryPage() {
  const session = await verifySession();
  if (!session) redirect("/login");

  const records = await prisma.usageRecord.findMany({
    where: { tenantId: session.tenantId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="p-6" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
      <h1 className="text-2xl font-bold text-[#0F0F0E]">Request History</h1>
      <p className="mt-1 text-sm text-[#7A7870]">Last 100 API calls</p>

      <div className="mt-6 overflow-hidden rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F1EFE9]">
              <th className="px-4 py-3 text-left font-medium text-[#3A3A37]">Time</th>
              <th className="px-4 py-3 text-left font-medium text-[#3A3A37]">Model</th>
              <th className="px-4 py-3 text-left font-medium text-[#3A3A37]">Status</th>
              <th className="px-4 py-3 text-right font-medium text-[#3A3A37]">Input</th>
              <th className="px-4 py-3 text-right font-medium text-[#3A3A37]">Output</th>
              <th className="px-4 py-3 text-right font-medium text-[#3A3A37]">Cost</th>
              <th className="px-4 py-3 text-right font-medium text-[#3A3A37]">Latency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(15,15,14,0.06)]">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-[#F9F9F6] transition-colors">
                <td className="px-4 py-3 text-[#7A7870] whitespace-nowrap">
                  {formatDate(new Date(r.createdAt))}
                </td>
                <td className="px-4 py-3 text-xs text-[#3A3A37]">
                  {r.modelId}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3 text-right text-xs tabular-nums text-[#3A3A37]">
                  {r.tokensInput.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-xs tabular-nums text-[#3A3A37]">
                  {r.tokensOutput.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-xs tabular-nums text-[#3A3A37]">
                  ${r.cost.toFixed(5)}
                </td>
                <td className="px-4 py-3 text-right text-xs tabular-nums text-[#3A3A37]">
                  {r.latencyMs}ms
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
