import { verifySession } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const roleBadgeClasses: Record<string, string> = {
  OWNER: "bg-[#F3E8FF] text-[#7E22CE]",
  ADMIN: "bg-[#DBEAFE] text-[#1E40AF]",
  MEMBER: "bg-[rgba(15,15,14,0.06)] text-[#3A3A37]",
};

export default async function AdminUsersPage() {
  const session = await verifySession();
  if (!session || session.role === "MEMBER") redirect("/login");

  const users = await prisma.user.findMany({
    include: { tenant: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#F9F9F6] p-6">
      <h1 className="text-2xl font-bold text-[#0F0F0E]">Users</h1>
      <p className="mt-1 text-sm text-[#7A7870]">
        Manage all platform users
      </p>

      <div className="mt-6 rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F1EFE9]">
              <th className="px-4 py-3 text-left font-medium text-[#3A3A37] rounded-tl-[14px]">Name</th>
              <th className="px-4 py-3 text-left font-medium text-[#3A3A37]">Email</th>
              <th className="px-4 py-3 text-left font-medium text-[#3A3A37]">Tenant</th>
              <th className="px-4 py-3 text-left font-medium text-[#3A3A37]">Role</th>
              <th className="px-4 py-3 text-left font-medium text-[#3A3A37]">Status</th>
              <th className="px-4 py-3 text-left font-medium text-[#3A3A37] rounded-tr-[14px]">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(15,15,14,0.08)]">
            {users.map((u) => {
              const roleClasses = roleBadgeClasses[u.role] ?? roleBadgeClasses.MEMBER;
              const statusClasses = u.isActive
                ? "bg-[#DCFCE7] text-[#15803D]"
                : "bg-[#FEE2E2] text-[#B91C1C]";
              return (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-medium text-[#0F0F0E]">{u.name ?? "\u2014"}</td>
                  <td className="px-4 py-3 text-[#3A3A37]">{u.email}</td>
                  <td className="px-4 py-3 text-[#3A3A37]">{u.tenant.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${roleClasses}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusClasses}`}>
                      {u.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#7A7870]">
                    {new Date(u.createdAt).toLocaleDateString()}
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
