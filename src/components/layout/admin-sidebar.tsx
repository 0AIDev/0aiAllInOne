"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Server,
  GitBranch,
  DollarSign,
  Users,
  ArrowLeft,
} from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/providers", label: "Providers", icon: Server },
  { href: "/admin/routing", label: "Routing", icon: GitBranch },
  { href: "/admin/revenue", label: "Revenue", icon: DollarSign },
  { href: "/admin/users", label: "Users", icon: Users },
];

interface AdminSidebarProps {
  email: string;
}

export function AdminSidebar({ email }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r bg-white"
      style={{ borderColor: "rgba(15,15,14,0.08)", fontFamily: "'Inter Tight', sans-serif" }}
    >
      <div
        className="flex h-14 items-center gap-2.5 border-b px-5"
        style={{ borderColor: "rgba(15,15,14,0.08)" }}
      >
        <span
          className="inline-flex size-7 items-center justify-center rounded-md bg-[#0F0F0E] text-base italic text-white"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          A
        </span>
        <div>
          <Link href="/admin" className="text-base font-semibold tracking-tight text-[#0F0F0E]">
            AIStack
          </Link>
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#7A7870]">Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {adminLinks.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[rgba(15,15,14,0.06)] text-[#0F0F0E]"
                  : "text-[#7A7870] hover:bg-[rgba(15,15,14,0.03)] hover:text-[#3A3A37]"
              )}
            >
              <link.icon className="size-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div
        className="border-t px-4 py-3 space-y-2"
        style={{ borderColor: "rgba(15,15,14,0.08)" }}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#7A7870] transition-colors hover:bg-[rgba(15,15,14,0.03)] hover:text-[#3A3A37]"
        >
          <ArrowLeft className="size-4 shrink-0" />
          Back to Dashboard
        </Link>
        <p className="truncate px-3 text-xs text-[#7A7870]">{email}</p>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[#7A7870] transition-colors hover:bg-[rgba(239,68,68,0.06)] hover:text-red-600"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
