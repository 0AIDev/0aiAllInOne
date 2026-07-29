"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, LogOut, User } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { useLocale } from "@/i18n/locale-provider";

interface NavbarProps {
  user: { name: string; email: string } | null;
  className?: string;
}

const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/providers", label: "Providers" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/api-reference", label: "API" },
  { href: "/cli", label: "CLI" },
];

export function Navbar({ user, className }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  const initials = user
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "";

  const { t } = useLocale();

  return (
    <header
      className={cn(
        "fixed top-3 left-0 right-0 z-100 flex justify-center px-4 transition-all duration-300",
        scrolled ? "top-2" : "top-3",
        className
      )}
    >
      <nav
        className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 shadow-[rgba(0,0,0,0.04)_-0.5px_-0.5px_0px_0px_inset,rgba(0,0,0,0.04)_-2px_-2px_4px_0px_inset,rgb(255,255,255)_2px_2px_2px_0px_inset,rgba(15,14,41,0.03)_0px_0.78px_0.78px_-0.54px,rgba(15,14,41,0.03)_0px_1.92px_1.92px_-1.07px,rgba(15,14,41,0.03)_0px_3.64px_3.64px_-1.6px,rgba(15,14,41,0.03)_0px_6.35px_6.35px_-2.14px,rgba(15,14,41,0.02)_0px_11.05px_11.05px_-2.68px,rgba(15,14,41,0.02)_0px_20.24px_20.24px_-3.21px,rgba(15,14,41,0.01)_0px_40px_40px_-3.75px]"
        style={{
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          background: "rgba(255,255,255,0.15)",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5 pl-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0F0F0E] text-[11px] font-bold italic text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>
            A
          </div>
          <span className="text-sm font-bold tracking-tight text-[#0F0F0E]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
            AI0FY
          </span>
        </Link>

        {/* Links + CTA */}
        <div className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-[12px] font-medium tracking-[-0.02em] text-[#7A7870] transition-colors hover:text-[#0F0F0E]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              {t("nav." + link.label.toLowerCase().replace(/ /g, "-"))}
            </Link>
          ))}
          <span className="mx-1 h-4 w-px bg-[rgba(15,15,14,0.12)]" />
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-[rgba(15,15,14,0.1)] bg-white px-3 py-1.5 text-[12px] font-medium text-[#3A3A37] transition-colors hover:bg-[rgba(15,15,14,0.03)]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0F0F0E] text-[10px] font-semibold text-white">
                  {initials}
                </div>
                <span className="max-w-[80px] truncate">{user.name}</span>
                <ChevronDown className={cn("size-3 transition-transform", dropdownOpen && "rotate-180")} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-[rgba(15,15,14,0.1)] bg-white py-1 shadow-lg">
                  <div className="border-b border-[rgba(15,15,14,0.08)] px-4 py-3">
                    <p className="text-sm font-semibold text-[#0F0F0E]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>{user.name}</p>
                    <p className="text-xs text-[#7A7870]">{user.email}</p>
                  </div>
                  <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#3A3A37] transition-colors hover:bg-[rgba(15,15,14,0.04)]">
                    <User className="size-4" /> Dashboard
                  </Link>
                  <Link href="/api/auth/logout" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#3A3A37] transition-colors hover:bg-[rgba(239,68,68,0.06)] hover:text-red-600">
                    <LogOut className="size-4" /> Logout
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
              className="rounded-full px-3.5 py-2 text-[12px] font-medium tracking-[-0.02em] text-[#7A7870] transition-colors hover:text-[#0F0F0E]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                {t("nav.signIn")}
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[#0F0F0E] px-4 py-2 text-[12px] font-medium tracking-[-0.02em] text-white transition-opacity hover:opacity-90"
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  boxShadow: "rgb(255,255,255) 0px 0px 0px 1px inset, rgba(15,14,41,0.06) 0px 1px 2px",
                }}
              >
                {t("nav.startFree")}
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full p-2 text-[#3A3A37] transition-colors hover:bg-[rgba(15,15,14,0.05)] md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed bottom-0 right-0 top-16 z-50 w-full max-w-sm overflow-y-auto bg-white shadow-2xl md:hidden">
            <div className="flex flex-col gap-1 px-6 py-4" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#3A3A37] transition-colors hover:bg-[rgba(15,15,14,0.05)] hover:text-[#0F0F0E]">
                  {t("nav." + link.label.toLowerCase().replace(/ /g, "-"))}
                </Link>
              ))}
              <div className="my-3 h-px bg-[rgba(15,15,14,0.1)]" />
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F0F0E] text-xs font-semibold text-white">{initials}</div>
                    <div>
                      <p className="text-sm font-medium text-[#0F0F0E]">{user.name}</p>
                      <p className="text-xs text-[#7A7870]">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-[#3A3A37] transition-colors hover:bg-[rgba(15,15,14,0.05)]"><User className="size-4" /> Dashboard</Link>
                  <Link href="/api/auth/logout" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"><LogOut className="size-4" /> Logout</Link>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#3A3A37] transition-colors hover:bg-[rgba(15,15,14,0.05)]">{t("nav.signIn")}</Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="mt-1 rounded-lg bg-[#0F0F0E] px-4 py-2.5 text-center text-sm font-medium text-white transition-opacity hover:opacity-90">{t("nav.startFree")}</Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
