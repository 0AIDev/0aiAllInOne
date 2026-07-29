"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Key,
  BarChart3,
  CreditCard,
  History,
  Server,
  GitBranch,
  DollarSign,
  Users,
  Sparkles,
  Plug,
} from "lucide-react";

const userLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/onboarding", label: "Setup", icon: Plug },
  { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { href: "/dashboard/usage", label: "Usage", icon: BarChart3 },
  { href: "/dashboard/subscription", label: "Subscription", icon: CreditCard },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/creator", label: "Creator Portal", icon: Sparkles },
];

const adminLinks = [
  { href: "/admin/providers", label: "Providers", icon: Server },
  { href: "/admin/routing", label: "Routing", icon: GitBranch },
  { href: "/admin/revenue", label: "Revenue", icon: DollarSign },
  { href: "/admin/users", label: "Users", icon: Users },
];

interface DashboardSidebarProps {
  email: string;
  isAdmin: boolean;
}

export function DashboardSidebar({ email, isAdmin }: DashboardSidebarProps) {
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
        <Link
          href="/dashboard"
          className="text-base font-semibold tracking-tight text-[#0F0F0E]"
        >
          AIStack
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {userLinks.map((link) => {
          const isActive =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
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

        {isAdmin && (
          <>
            <p className="mb-1 mt-5 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#7A7870]">
              Admin
            </p>
            {adminLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
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
          </>
        )}
      </nav>

      <div
        className="border-t px-4 py-3"
        style={{ borderColor: "rgba(15,15,14,0.08)" }}
      >
        <p className="truncate px-0.5 text-xs text-[#7A7870]">{email}</p>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[#7A7870] transition-colors hover:bg-[rgba(239,68,68,0.06)] hover:text-red-600"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
