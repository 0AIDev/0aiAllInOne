"use client";

import { type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { SquircleNoScript } from "@squircle-js/react";
import { LocaleProvider } from "@/i18n/locale-provider";

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" disableTransitionOnChange>
      <LenisProvider>
        <LocaleProvider>{children}</LocaleProvider>
      </LenisProvider>
      <SquircleNoScript />
    </ThemeProvider>
  );
}
