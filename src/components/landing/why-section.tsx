"use client";import { useLocale } from "@/i18n/locale-provider";

import { cn } from "@/lib/utils/cn";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const rows = [
  { pain: "Quota expires unused", fix: "Track & drain every free token" },
  { pain: "Rate limits stop you mid-task", fix: "4-tier auto-fallback in milliseconds" },
  { pain: "Tool output burns tokens", fix: "RTK + Caveman compression, 15–95% saved" },
  { pain: "Expensive APIs at $20-200/mo each", fix: "Cost-optimized routing - one subscription covers all" },
  { pain: "Each tool needs its own setup", fix: "One endpoint, every tool works" },
  { pain: "AI blocked in your region", fix: "3-level proxy + TLS fingerprint stealth" },
];

function WhyRow({ pain, fix, index }: (typeof rows)[number] & { index: number }) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-[10px] border border-[rgba(15,15,14,0.08)] bg-white transition-all duration-500",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      )}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="grid grid-cols-2 divide-x divide-[rgba(15,15,14,0.08)]">
        <div className="flex items-center gap-3 bg-[rgba(15,15,14,0.02)] px-5 py-4">
          <span className="shrink-0 text-xs font-bold text-[#7A7870]">—</span>
          <span className="text-sm font-medium text-red-600">{pain}</span>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-4">
          <span className="shrink-0 text-xs font-bold text-[#0F0F0E]">+</span>
          <span className="text-sm font-medium text-emerald-600">{fix}</span>
        </div>
      </div>
    </div>
  );
}

export function WhySection() {
  const { t } = useLocale();
  const { ref: tagRef, isVisible: tagVisible } = useScrollReveal();
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
  const { ref: subRef, isVisible: subVisible } = useScrollReveal();
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: rowsRef, isVisible: rowsVisible } = useScrollReveal({ threshold: 0.05 });

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
          {t("why.tag")}
        </p>

        <h2
          ref={titleRef}
          className={cn(
            "mt-5 text-center text-[clamp(32px,5vw,48px)] font-medium leading-[1.15] tracking-[-0.02em] text-[#0F0F0E] transition-all duration-700 delay-100",
            titleVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
          style={{ fontFamily: "'Inter Tight', sans-serif" }}
        >
          {t("why.title")}{" "}
          <em className="italic" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
            {t("why.titleEmphasis")}
          </em>
          . No scripts, no babysitting.
        </h2>

        <p
          ref={subRef}
          className={cn(
            "mx-auto mt-4 max-w-xl text-center text-[18px] leading-relaxed text-[#3A3A37] transition-all duration-700 delay-200",
            subVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          {t("why.subtitle")}
        </p>

        <div
          ref={headerRef}
          className={cn(
            "mx-auto mt-12 max-w-3xl transition-all duration-700 delay-300",
            headerVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          <div className="grid grid-cols-2 divide-x divide-[rgba(15,15,14,0.08)]">
            <div className="px-5 pb-3">
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-red-600">{t("why.painHeader")}</span>
            </div>
            <div className="px-5 pb-3">
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-emerald-600">{t("why.fixHeader")}</span>
            </div>
          </div>
        </div>

        <div
          ref={rowsRef}
          className={cn(
            "mx-auto mt-3 max-w-3xl space-y-2 transition-all duration-700 delay-500",
            rowsVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          {rows.map((row, idx) => (
            <WhyRow key={row.pain} {...row} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
