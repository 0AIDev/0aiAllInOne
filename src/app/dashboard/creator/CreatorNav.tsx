"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { LayoutDashboard, Wallet } from "lucide-react";

const links = [
  { href: "/dashboard/creator", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/creator/payouts", label: "Payouts", icon: Wallet },
];

export function CreatorNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {links.map((link) => {
        const isActive =
          link.href === "/dashboard/creator"
            ? pathname === "/dashboard/creator"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-[rgba(15,15,14,0.06)] text-[#0F0F0E]"
                : "text-[#7A7870] hover:bg-[rgba(15,15,14,0.03)] hover:text-[#3A3A37]"
            )}
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            <link.icon className="size-4 shrink-0" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
