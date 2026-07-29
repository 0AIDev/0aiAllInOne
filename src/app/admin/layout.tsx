import { verifySession } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  if (!session || session.email !== "admin@ai0fy.local") redirect("/login");

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.tenantId },
    select: { creditsRemaining: true },
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar email={session.email} credits={tenant?.creditsRemaining ?? 0} />
      <main className="ml-60 flex-1 overflow-y-auto bg-[#F9F9F6]">{children}</main>
    </div>
  );
}
