"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body
        className="min-h-screen bg-[#F9F9F6] antialiased"
        style={{ fontFamily: "'Inter Tight', sans-serif" }}
      >
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#7A7870]">
            Error
          </p>
          <h1
            className="mt-4 text-[clamp(40px,7vw,72px)] font-medium leading-[1.05] tracking-[-0.03em] text-[#0F0F0E]"
          >
            Something went{" "}
            <em
              className="italic"
              style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
            >
              wrong
            </em>
          </h1>
          <p className="mt-4 max-w-md text-center text-[17px] leading-relaxed text-[#3A3A37]">
            An unexpected error occurred. Please try again, or return to the home page.
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-[#7A7870]">Error ID: {error.digest}</p>
          )}
          <div className="mt-10 flex items-center gap-4">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-[10px] bg-[#0F0F0E] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3A3A37]"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-white px-6 py-3 text-sm font-medium text-[#3A3A37] transition-colors hover:bg-[rgba(15,15,14,0.03)]"
            >
              Go Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
