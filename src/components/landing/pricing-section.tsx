"use client";import { useLocale } from "@/i18n/locale-provider";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Squircle } from "@squircle-js/react";

const ti = (t: (key: string) => string) => [
  {
    name: t("pricing.tier1Name"),
    price: (isYearly: boolean) => isYearly ? t("pricing.tier1Price") : t("pricing.tier1Price"),
    period: t("pricing.tier1Period"),
    features: [
      t("pricing.tier1Feature1"), t("pricing.tier1Feature2"), t("pricing.tier1Feature3"),
      t("pricing.tier1Feature4"), t("pricing.tier1Feature5"), t("pricing.tier1Feature6"),
    ],
    cta: t("pricing.tier1Cta"),
    href: "/register",
    highlighted: false,
  },
  {
    name: t("pricing.tier2Name"),
    price: (isYearly: boolean) => isYearly ? t("pricing.tier2PriceYearly") : t("pricing.tier2PriceMonthly"),
    period: t("pricing.tier2Period"),
    features: [
      t("pricing.tier2Feature1"), t("pricing.tier2Feature2"), t("pricing.tier2Feature3"),
      t("pricing.tier2Feature4"), t("pricing.tier2Feature5"), t("pricing.tier2Feature6"),
      t("pricing.tier2Feature7"),
    ],
    cta: t("pricing.tier2Cta"),
    href: "/register?tier=starter",
    highlighted: false,
  },
  {
    name: t("pricing.tier3Name"),
    price: (isYearly: boolean) => isYearly ? t("pricing.tier3PriceYearly") : t("pricing.tier3PriceMonthly"),
    period: t("pricing.tier3Period"),
    features: [
      t("pricing.tier3Feature1"), t("pricing.tier3Feature2"), t("pricing.tier3Feature3"),
      t("pricing.tier3Feature4"), t("pricing.tier3Feature5"), t("pricing.tier3Feature6"),
      t("pricing.tier3Feature7"), t("pricing.tier3Feature8"), t("pricing.tier3Feature9"),
    ],
    cta: t("pricing.tier3Cta"),
    href: "/register?tier=pro",
    highlighted: true,
  },
  {
    name: t("pricing.tier4Name"),
    price: () => t("pricing.tier4PriceMonthly"),
    period: t("pricing.tier4Period"),
    features: [
      t("pricing.tier4Feature1"), t("pricing.tier4Feature2"), t("pricing.tier4Feature3"),
      t("pricing.tier4Feature4"), t("pricing.tier4Feature5"), t("pricing.tier4Feature6"),
      t("pricing.tier4Feature7"), t("pricing.tier4Feature8"), t("pricing.tier4Feature9"),
    ],
    cta: t("pricing.tier4Cta"),
    href: "/contact",
    highlighted: false,
  },
];

function PricingCard({
  name,
  price,
  period,
  features,
  cta,
  href,
  highlighted,
  isYearly,
  index,
}: {
  name: string; price: (isYearly: boolean) => string; period: string;
  features: string[]; cta: string; href: string; highlighted: boolean;
  isYearly: boolean; index: number;
}) {
  const { t } = useLocale();
  const { ref, isVisible } = useScrollReveal();

  return (
    <div ref={ref} className={cn("relative transition-all duration-500", isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0")} style={{ transitionDelay: `${index * 100}ms` }}>
      {highlighted && (
        <div className="absolute left-1/2 -top-3 z-20 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-[11px] font-medium text-[#0F0F0E] shadow-[0_2px_8px_rgba(15,15,14,0.1)]">
          {t("pricing.mostPopular")}
        </div>
      )}
    <Squircle
      cornerRadius={14}
      cornerSmoothing={1}
      className={cn(
        "flex flex-col border sm:p-8",
        highlighted
          ? "border-transparent bg-[#0F0F0E] text-white pt-10"
          : "border-[rgba(15,15,14,0.08)] bg-white p-6"
      )}
    >

      <div className="mb-5">
        <h3
          className={cn(
            "text-lg font-medium tracking-[-0.01em]",
            highlighted ? "text-white" : "text-[#0F0F0E]"
          )}
          style={{ fontFamily: "'Inter Tight', sans-serif" }}
        >
          {name}
        </h3>
      </div>

      <div className="mb-6">
        <span
          className={cn(
            "text-[44px] font-medium leading-none tracking-[-0.02em]",
            highlighted ? "text-white" : "text-[#0F0F0E]"
          )}
          style={{ fontFamily: "'Inter Tight', sans-serif" }}
        >
          {price(isYearly)}
        </span>
        {period && (
          <span
            className={cn(
              "text-sm",
              highlighted ? "text-white/50" : "text-[#7A7870]"
            )}
          >
            {period}
          </span>
        )}
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm">
            <Check
              className={cn(
                "mt-0.5 h-4 w-4 flex-shrink-0",
                highlighted ? "text-white/60" : "text-[#10b981]"
              )}
            />
            <span
              className={cn(
                "leading-relaxed",
                highlighted ? "text-white/70" : "text-[#3A3A37]"
              )}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-[10px] px-6 py-3 text-sm font-medium transition-colors",
          highlighted
            ? "bg-white text-[#0F0F0E] hover:bg-white/90"
            : "border border-[rgba(15,15,14,0.12)] bg-white text-[#0F0F0E] hover:bg-[rgba(15,15,14,0.03)]"
        )}
      >
        {cta}
        {highlighted && <ArrowRight className="h-4 w-4" />}
      </Link>
    </Squircle>
    </div>
  );
}

export function PricingSection() {
  const { t } = useLocale();
  const [isYearly, setIsYearly] = useState(false);
  const { ref: tagRef, isVisible: tagVisible } = useScrollReveal();
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
  const { ref: descRef, isVisible: descVisible } = useScrollReveal();
  const { ref: toggleRef, isVisible: toggleVisible } = useScrollReveal();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal({ threshold: 0.05 });
  const { ref: noteRef, isVisible: noteVisible } = useScrollReveal();

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
          {t("pricing.tag")}
        </p>

        <h2
          ref={titleRef}
          className={cn(
            "mt-5 text-center text-[clamp(32px,5vw,48px)] font-medium leading-[1.15] tracking-[-0.02em] text-[#0F0F0E] transition-all duration-700 delay-100",
            titleVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
          style={{ fontFamily: "'Inter Tight', sans-serif" }}
        >
          {t("pricing.title")}{" "}
          <em className="italic" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>{t("pricing.titleEmphasis")}</em> as you grow.
        </h2>

        <p
          ref={descRef}
          className={cn(
            "mx-auto mt-4 max-w-xl text-center text-[18px] leading-relaxed text-[#3A3A37] transition-all duration-700 delay-200",
            descVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          {t("pricing.subtitle")}
        </p>

        <div
          ref={toggleRef}
          className={cn(
            "mt-10 flex items-center justify-center gap-3 transition-all duration-700 delay-300",
            toggleVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          <button
            onClick={() => setIsYearly(false)}
            className={cn(
              "text-sm transition-colors",
              !isYearly ? "font-medium text-[#0F0F0E]" : "text-[#7A7870]"
            )}
          >
            {t("pricing.monthly")}
          </button>
          <button
            onClick={() => setIsYearly((prev) => !prev)}
            className="relative flex h-7 w-12 items-center rounded-full bg-[rgba(15,15,14,0.08)] p-0.5 transition-colors"
          >
            <div
              className={cn(
                "h-6 w-6 rounded-full bg-[#0F0F0E] transition-transform",
                isYearly ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={cn(
              "text-sm transition-colors",
              isYearly ? "font-medium text-[#0F0F0E]" : "text-[#7A7870]"
            )}
          >
            {t("pricing.yearly")}
          </button>
          {isYearly && (
            <span className="ml-1 rounded-full bg-[rgba(15,15,14,0.06)] px-2 py-0.5 text-[11px] text-[#3A3A37]">
              {t("pricing.saveBadge")}
            </span>
          )}
        </div>

        <div
          ref={gridRef}
          className={cn(
            "mt-12 grid gap-6 transition-all duration-700 delay-300 sm:grid-cols-2 lg:grid-cols-4",
            gridVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          {ti(t).map((tier, idx) => (
            <PricingCard key={tier.name} {...tier} isYearly={isYearly} price={tier.price} index={idx} />
          ))}
        </div>

        <p
          ref={noteRef}
          className={cn(
            "mt-10 text-center text-xs text-[#7A7870] transition-all duration-700 delay-500",
            noteVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          {t("pricing.note")}
        </p>
      </div>
    </section>
  );
}
