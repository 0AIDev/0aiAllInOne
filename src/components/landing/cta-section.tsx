"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useLocale } from "@/i18n/locale-provider";

export function CtaSection() {
  const { t } = useLocale();
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal({
    threshold: 0.1,
  });

  return (
    <section className="pb-12 pt-24 sm:pb-20 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={sectionRef}
          className={cn(
            "grid gap-10 rounded-[20px] bg-[#0F0F0E] px-8 py-14 transition-all duration-700 sm:px-14 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16",
            sectionVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          )}
        >
          {/* Left */}
          <div>
            <h2
              className="text-[clamp(32px,5vw,48px)] font-medium leading-[1.15] tracking-[-0.02em] text-white"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              {t("cta.title")}{" "}
              <em
                className="italic"
                style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
              >
                {t("cta.titleEmphasis")}
              </em>{" "}
              free.
            </h2>
            <p className="mt-4 max-w-md text-[18px] leading-relaxed text-white/60">
              {t("cta.subtitle")}
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center justify-start lg:justify-end">
            <Link
              href="/register"
              className="inline-flex items-center gap-3 rounded-[10px] bg-white px-8 py-4 text-base font-medium text-[#0F0F0E] transition-colors hover:bg-white/90"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              {t("cta.cta")}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
