import { verifySession } from "@/lib/auth/auth-options";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  if (!session || !["OWNER", "ADMIN"].includes(session.role)) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar email={session.email} />
      <main className="ml-60 flex-1 overflow-y-auto bg-[#F9F9F6]">{children}</main>
    </div>
  );
}
