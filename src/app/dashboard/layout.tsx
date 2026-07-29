import { verifySession } from "@/lib/auth/auth-options";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar
        email={session.email}
        isAdmin={session.role !== "MEMBER"}
      />
      <main className="ml-60 flex-1 overflow-auto bg-[#F9F9F6]">{children}</main>
    </div>
  );
}
