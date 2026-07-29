import { verifySession } from "@/lib/auth/auth-options";
import { redirect } from "next/navigation";
import { CreatorNav } from "./CreatorNav";

export default async function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-[#F9F9F6]">
      <div
        className="flex items-center justify-between border-b px-8 py-4"
        style={{ borderColor: "rgba(15,15,14,0.08)" }}
      >
        <div>
          <h1
            className="text-[22px] font-semibold tracking-tight text-[#0F0F0E]"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            Creator Portal
          </h1>
          <p
            className="text-sm text-[#7A7870]"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            Manage your skills and earnings
          </p>
        </div>
        <CreatorNav />
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
}
