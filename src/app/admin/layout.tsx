import { verifySession } from "@/lib/auth/auth-options";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  if (!session || session.role === "MEMBER") redirect("/login");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar email={session.email} />
      <main className="ml-60 flex-1 overflow-auto bg-[#F9F9F6]">{children}</main>
    </div>
  );
}
