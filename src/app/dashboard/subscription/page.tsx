import { verifySession } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PlanCards } from "./plan-cards";

export default async function SubscriptionPage(props: { searchParams?: Promise<{ require_payment?: string }> }) {
  const session = await verifySession();
  if (!session) redirect("/login");
  const searchParams = props.searchParams ? await props.searchParams : {};
  const requirePayment = searchParams?.require_payment === "true";

  const [tenant, subscription, invoices, plans] = await Promise.all([
    prisma.tenant.findUnique({ where: { id: session.tenantId }, include: { subscription: true } }),
    prisma.subscription.findFirst({ where: { tenantId: session.tenantId }, orderBy: { createdAt: "desc" } }),
    prisma.invoice.findMany({ where: { subscription: { tenantId: session.tenantId } }, orderBy: { createdAt: "desc" }, take: 12 }),
    prisma.plan.findMany({ where: { isPublic: true }, orderBy: { sortOrder: "asc" } }).catch(() => []),
  ]);

  if (!tenant) redirect("/login");

  const planLabel = tenant.planTier.charAt(0) + tenant.planTier.slice(1).toLowerCase();

  return (
    <div className="p-6" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
      <h1 className="text-2xl font-bold text-[#0F0F0E]">Subscription</h1>
      <p className="mt-1 text-sm text-[#7A7870]">Manage your plan and billing</p>

      <div className="mt-6 rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0F0F0E]">
              {planLabel} Plan
            </h2>
            <p className="mt-1 text-sm text-[#7A7870]">
              {subscription
                ? `${subscription.billingInterval === "MONTHLY" ? "Monthly" : "Yearly"} billing`
                : "Free tier"}
            </p>
            {subscription?.currentPeriodEnd && (
              <p className="mt-1 text-xs text-[#7A7870]">
                Current period ends:{" "}
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-[#0F0F0E] tabular-nums">
              {tenant.hardQuotaTokens.toLocaleString()}
            </p>
            <p className="text-xs text-[#7A7870]">tokens / month</p>
          </div>
        </div>
      </div>

      {requirePayment && (
        <div className="mb-6 rounded-[14px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Your current plan requires payment. Choose a payment method below to continue using the dashboard.
        </div>
      )}
      <PlanCards plans={plans} currentTier={tenant.planTier} />

      {invoices.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-[#0F0F0E]">Billing History</h2>
          <div className="mt-3 overflow-hidden rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F1EFE9]">
                  <th className="px-4 py-3 text-left font-medium text-[#3A3A37]">Invoice</th>
                  <th className="px-4 py-3 text-left font-medium text-[#3A3A37]">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-[#3A3A37]">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-[#3A3A37]">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(15,15,14,0.06)]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#F9F9F6] transition-colors">
                    <td className="px-4 py-3 text-[#0F0F0E]">
                      {inv.hostedUrl ? (
                        <a
                          href={inv.hostedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0F0F0E] underline underline-offset-4 hover:opacity-70 transition-opacity"
                        >
                          {inv.stripeInvoiceId.substring(0, 12)}&hellip;
                        </a>
                      ) : (
                        <span>{inv.stripeInvoiceId.substring(0, 12)}&hellip;</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs tabular-nums text-[#3A3A37]">
                      ${(inv.amount / 100).toFixed(2)} {inv.currency.toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      {inv.status === "paid" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-2.5 py-0.5 text-xs font-medium text-[#2E7D32]">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2E7D32]" />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF8E1] px-2.5 py-0.5 text-xs font-medium text-[#F57F17]">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#F57F17]" />
                          {inv.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#7A7870]">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
