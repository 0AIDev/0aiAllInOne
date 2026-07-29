"use client";

import { useState } from "react";
import Link from "next/link";
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
  Menu,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const userLinks: NavLink[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { href: "/dashboard/usage", label: "Usage", icon: BarChart3 },
  { href: "/dashboard/subscription", label: "Subscription", icon: CreditCard },
  { href: "/dashboard/history", label: "History", icon: History },
];

const adminLinks: NavLink[] = [
  { href: "/admin/providers", label: "Providers", icon: Server },
  { href: "/admin/routing", label: "Routing", icon: GitBranch },
  { href: "/admin/revenue", label: "Revenue", icon: DollarSign },
  { href: "/admin/users", label: "Users", icon: Users },
];

interface SidebarProps {
  isAdmin: boolean;
  email?: string;
  currentPath: string;
  className?: string;
}

export function Sidebar({ isAdmin, currentPath, email, className }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => currentPath === href;

  const linkClasses = (href: string) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
      "font-['Inter_Tight']",
      isActive(href)
        ? "bg-[rgba(15,15,14,0.06)] font-medium text-[#0F0F0E]"
        : "text-[#7A7870] hover:bg-[rgba(15,15,14,0.03)] hover:text-[#3A3A37]"
    );

  const NavLinks = ({ links }: { links: NavLink[] }) => (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={linkClasses(link.href)}
          onClick={() => setMobileOpen(false)}
        >
          <link.icon className="size-4 shrink-0" />
          {link.label}
        </Link>
      ))}
    </>
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 bg-white shadow-sm md:hidden"
        style={{ borderColor: "rgba(15,15,14,0.08)" }}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="size-5 text-[#0F0F0E]" /> : <Menu className="size-5 text-[#0F0F0E]" />}
      </Button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r bg-white transition-transform duration-200 ease-in-out md:static md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
        style={{ borderColor: "rgba(15,15,14,0.08)" }}
      >
        <div
          className="flex h-14 items-center gap-2.5 border-b px-5"
          style={{ borderColor: "rgba(15,15,14,0.08)" }}
        >
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-[#0F0F0E] font-['Instrument_Serif'] text-base italic text-white">
            A
          </span>
          <Link
            href="/dashboard"
            className="font-['Inter_Tight'] text-base font-semibold tracking-tight text-[#0F0F0E]"
          >
            AI0FY
          </Link>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 font-['Inter_Tight'] text-[11px] font-semibold uppercase tracking-wider text-[#7A7870]">
            Main
          </p>
          <NavLinks links={userLinks} />

          {isAdmin && (
            <>
              <p className="mb-2 mt-5 px-3 font-['Inter_Tight'] text-[11px] font-semibold uppercase tracking-wider text-[#7A7870]">
                Admin
              </p>
              <NavLinks links={adminLinks} />
            </>
          )}
        </nav>

        {email && (
          <div
            className="border-t px-4 py-3"
            style={{ borderColor: "rgba(15,15,14,0.08)" }}
          >
            <p className="truncate px-0.5 font-['Inter_Tight'] text-xs text-[#7A7870]">
              {email}
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
