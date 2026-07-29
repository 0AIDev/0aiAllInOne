"use client";

import { Key, UserPlus, Zap } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useLocale } from "@/i18n/locale-provider";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "workflow.step1Title",
    description: "workflow.step1Desc",
  },
  {
    number: "02",
    icon: Key,
    title: "workflow.step2Title",
    description: "workflow.step2Desc",
  },
  {
    number: "03",
    icon: Zap,
    title: "workflow.step3Title",
    description: "workflow.step3Desc",
  },
];

function StepCard({ number, icon: Icon, title, description, index }: (typeof steps)[number] & { index: number }) {
  const { t } = useLocale();
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center text-center transition-all duration-700",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      )}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      <span
        className="text-[clamp(64px,10vw,120px)] leading-none italic text-[rgba(15,15,14,0.12)]"
        style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
      >
        {number}
      </span>
      <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-[14px] bg-[rgba(15,15,14,0.04)]">
        <Icon className="h-7 w-7 text-[#0F0F0E]" />
      </div>
      <h3
        className="mt-6 text-xl font-medium tracking-[-0.01em] text-[#0F0F0E] sm:text-2xl"
        style={{ fontFamily: "'Inter Tight', sans-serif" }}
      >
        {t(title)}
      </h3>
      <p className="mt-3 max-w-sm text-[16px] leading-relaxed text-[#3A3A37]">
        {t(description)}
      </p>
    </div>
  );
}

export function HowItWorks() {
  const { t } = useLocale();
  const { ref: tagRef, isVisible: tagVisible } = useScrollReveal();
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
  const { ref: subRef, isVisible: subVisible } = useScrollReveal();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section className="border-t border-[rgba(15,15,14,0.08)] bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p
            ref={tagRef}
            className={cn(
              "text-xs font-medium uppercase tracking-[0.15em] text-[#7A7870] transition-all duration-700",
              tagVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
          >
            {t("workflow.tag")}
          </p>
          <h2
            ref={titleRef}
            className={cn(
              "mt-5 text-[clamp(32px,5vw,48px)] font-medium leading-[1.15] tracking-[-0.02em] text-[#0F0F0E] transition-all duration-700 delay-100",
              titleVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            {t("workflow.title")}{" "}
            <em className="italic" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
              {t("workflow.titleEmphasis")}
            </em>{" "}
            friction.
          </h2>
          <p
            ref={subRef}
            className={cn(
              "mx-auto mt-4 max-w-xl text-[18px] leading-relaxed text-[#3A3A37] transition-all duration-700 delay-200",
              subVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
          >
            {t("workflow.subtitle")}
          </p>
        </div>

        <div
          ref={gridRef}
          className={cn(
            "mt-20 grid gap-16 transition-all duration-700 delay-300 sm:grid-cols-3 sm:gap-12",
            gridVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          {steps.map((step, idx) => (
            <StepCard key={step.number} {...step} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
