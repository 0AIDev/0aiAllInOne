import { verifySession } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

const PAID_PLANS = ["STARTER", "PRO", "BUSINESS", "ENTERPRISE"];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  if (!session) redirect("/login");

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.tenantId },
    select: { creditsRemaining: true, planTier: true },
  });

  if (!tenant) redirect("/login");

  // If user has a paid plan but no active subscription, redirect to subscription page
  if (PAID_PLANS.includes(tenant.planTier)) {
    const sub = await prisma.subscription.findFirst({
      where: { tenantId: session.tenantId, status: "ACTIVE" },
    });
    if (!sub) redirect("/dashboard/subscription?require_payment=true");
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar
        email={session.email}
        isAdmin={session.email === "admin@ai0fy.local"}
        credits={tenant?.creditsRemaining ?? 0}
      />
      <main className="ml-60 min-h-screen flex-1 bg-[#F9F9F6]">{children}</main>
    </div>
  );
}
