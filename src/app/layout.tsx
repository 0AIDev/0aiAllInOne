import type { Metadata } from "next";
import { ClientLayout } from "@/components/providers/client-layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIStack - AI Gateway for Multi-Provider LLMs",
  description:
    "Unified API endpoint with 290+ providers, auto-fallback, subscription management, and multi-tenant architecture",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.bunny.net"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.bunny.net/css?family=inter-tight:400,500,600,700|instrument-serif:400i|jetbrains-mono:400,500"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased" style={{ fontFamily: "'Inter Tight', sans-serif" }} suppressHydrationWarning>
        <div className="noise" />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
