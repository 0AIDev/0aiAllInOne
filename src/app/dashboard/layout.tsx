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
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar
        email={session.email}
        isAdmin={session.email === "admin@ai0fy.local"}
      />
      <main className="ml-60 flex-1 overflow-y-auto bg-[#F9F9F6]">{children}</main>
    </div>
  );
}
