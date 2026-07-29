"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9F9F6] px-4">
      <div className="text-center">
        <p
          className="text-xs font-medium uppercase tracking-[0.15em] text-[#7A7870]"
        >
          404
        </p>
        <h1
          className="mt-4 text-[clamp(40px,7vw,80px)] font-medium leading-[1.05] tracking-[-0.03em] text-[#0F0F0E]"
          style={{ fontFamily: "'Inter Tight', sans-serif" }}
        >
          Page not{" "}
          <em
            className="italic"
            style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
          >
            found
          </em>
        </h1>
        <p
          className="mx-auto mt-4 max-w-md text-[17px] leading-relaxed text-[#3A3A37]"
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-white px-6 py-3 text-sm font-medium text-[#3A3A37] transition-colors hover:bg-[rgba(15,15,14,0.03)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-[10px] bg-[#0F0F0E] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3A3A37]"
          >
            Go Home
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
