"use client";import { useLocale } from "@/i18n/locale-provider";

import Link from "next/link";
import { ArrowRight, Sparkles, DollarSign, Code, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function CreatorSection() {
  const { t } = useLocale();
  const { ref: tagRef, isVisible: tagVisible } = useScrollReveal();
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
  const { ref: subRef, isVisible: subVisible } = useScrollReveal();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollReveal({ threshold: 0.05 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal();

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p
          ref={tagRef}
          className={cn(
            "text-center text-xs font-medium uppercase tracking-[0.15em] text-[#7A7870] transition-all duration-700",
            tagVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          {t("creator.tag")}
        </p>
        <h2
          ref={titleRef}
          className={cn(
            "mt-5 text-center text-[clamp(32px,5vw,48px)] font-medium leading-[1.15] tracking-[-0.02em] text-[#0F0F0E] transition-all duration-700 delay-100",
            titleVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
          style={{ fontFamily: "'Inter Tight', sans-serif" }}
        >
          {t("creator.title")}{" "}
          <em className="italic" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
            {t("creator.titleEmphasis")}
          </em>{" "}
          revenue.
        </h2>
        <p
          ref={subRef}
          className={cn(
            "mx-auto mt-4 max-w-xl text-center text-[18px] leading-relaxed text-[#3A3A37] transition-all duration-700 delay-200",
            subVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          {t("creator.subtitle")}
        </p>

        <div
          ref={cardsRef}
          className={cn(
            "mt-14 grid gap-6 transition-all duration-700 delay-300 sm:grid-cols-3",
            cardsVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(15,15,14,0.04)]">
              <Code className="h-5 w-5 text-[#0F0F0E]" />
            </div>
            <h3 className="text-base font-semibold text-[#0F0F0E]">{t("creator.card1Title")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#3A3A37]">
              {t("creator.card1Desc")}
            </p>
          </div>
          <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(15,15,14,0.04)]">
              <DollarSign className="h-5 w-5 text-[#0F0F0E]" />
            </div>
            <h3 className="text-base font-semibold text-[#0F0F0E]">{t("creator.card2Title")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#3A3A37]">
              {t("creator.card2Desc")}
            </p>
          </div>
          <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(15,15,14,0.04)]">
              <Users className="h-5 w-5 text-[#0F0F0E]" />
            </div>
            <h3 className="text-base font-semibold text-[#0F0F0E]">{t("creator.card3Title")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#3A3A37]">
              {t("creator.card3Desc")}
            </p>
          </div>
        </div>

        <div
          ref={ctaRef}
          className={cn(
            "mt-10 text-center transition-all duration-700 delay-500",
            ctaVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-[10px] bg-[#0F0F0E] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3A3A37]"
          >
            <Sparkles className="h-4 w-4" />
            {t("creator.cta")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
