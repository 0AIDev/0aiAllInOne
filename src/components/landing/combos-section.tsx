"use client";import { useLocale } from "@/i18n/locale-provider";

import { cn } from "@/lib/utils/cn";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  Sparkles, Code, Zap, Coins, Wifi, Brain,
  ListOrdered, Gauge, Shuffle, ArrowRightLeft, ArrowDownUp,
  DollarSign, BarChart4, Timer, RefreshCw, BrainCircuit,
  Ruler, Database, Pin, Cpu, GitMerge, Link2,
} from "lucide-react";



function PresetCard({ name, label, description, icon: Icon, index }: {
  name: string; label: string; description: string; icon: React.ComponentType<{ className?: string }>; index: number;
}) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={cn(
        "group rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(15,15,14,0.06)]",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      )}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[10px] bg-[rgba(15,15,14,0.04)]">
        <Icon className="h-5 w-5 text-[#0F0F0E]" />
      </div>
      <code className="text-sm font-semibold tracking-[-0.01em] text-[#0F0F0E]">{name}</code>
      <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[#7A7870]">{label}</p>
      <p className="mt-3 text-sm leading-relaxed text-[#3A3A37]">{description}</p>
    </div>
  );
}

export function CombosSection() {
  const { t } = useLocale();

  const presets = [
    { name: "auto", label: t("combos.preset1Label"), description: t("combos.preset1Desc"), icon: Sparkles },
    { name: "auto/coding", label: t("combos.preset2Label"), description: t("combos.preset2Desc"), icon: Code },
    { name: "auto/fast", label: t("combos.preset3Label"), description: t("combos.preset3Desc"), icon: Zap },
    { name: "auto/cheap", label: t("combos.preset4Label"), description: t("combos.preset4Desc"), icon: Coins },
    { name: "auto/offline", label: t("combos.preset5Label"), description: t("combos.preset5Desc"), icon: Wifi },
    { name: "auto/smart", label: t("combos.preset6Label"), description: t("combos.preset6Desc"), icon: Brain },
  ];

  const strategies = [
    { name: t("combos.strat1"), icon: ListOrdered },
    { name: t("combos.strat2"), icon: Gauge },
    { name: t("combos.strat3"), icon: Shuffle },
    { name: t("combos.strat4"), icon: ArrowRightLeft },
    { name: t("combos.strat5"), icon: ArrowDownUp },
    { name: t("combos.strat6"), icon: BarChart4 },
    { name: t("combos.strat7"), icon: Shuffle },
    { name: t("combos.strat8"), icon: Shuffle },
    { name: t("combos.strat9"), icon: DollarSign },
    { name: t("combos.strat10"), icon: BarChart4 },
    { name: t("combos.strat11"), icon: Timer },
    { name: t("combos.strat12"), icon: RefreshCw },
    { name: t("combos.strat13"), icon: BrainCircuit },
    { name: t("combos.strat14"), icon: Ruler },
    { name: t("combos.strat15"), icon: Database },
    { name: t("combos.strat16"), icon: Pin },
    { name: t("combos.strat17"), icon: Cpu },
    { name: t("combos.strat18"), icon: GitMerge },
    { name: t("combos.strat19"), icon: Link2 },
  ];

  const { ref: tagRef, isVisible: tagVisible } = useScrollReveal();
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
  const { ref: subRef, isVisible: subVisible } = useScrollReveal();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal({ threshold: 0.05 });
  const { ref: stratsLabelRef, isVisible: stratsLabelVisible } = useScrollReveal();
  const { ref: stratsRef, isVisible: stratsVisible } = useScrollReveal({ threshold: 0.05 });

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
          {t("combos.tag")}
        </p>

        <h2
          ref={titleRef}
          className={cn(
            "mt-5 text-center text-[clamp(32px,5vw,48px)] font-medium leading-[1.15] tracking-[-0.02em] text-[#0F0F0E] transition-all duration-700 delay-100",
            titleVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
          style={{ fontFamily: "'Inter Tight', sans-serif" }}
        >
          {t("combos.title")}{" "}
          <em className="italic" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>{t("combos.titleEmphasis")}</em>.
        </h2>

        <p
          ref={subRef}
          className={cn(
            "mx-auto mt-4 max-w-xl text-center text-[18px] leading-relaxed text-[#3A3A37] transition-all duration-700 delay-200",
            subVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          {t("combos.subtitle")}
        </p>

        {/* Preset cards */}
        <div
          ref={gridRef}
          className={cn(
            "mt-14 grid gap-4 transition-all duration-700 delay-300 sm:grid-cols-2 lg:grid-cols-3",
            gridVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          {presets.map((preset, idx) => (
            <PresetCard key={preset.name} {...preset} index={idx} />
          ))}
        </div>

        {/* Strategies — compact */}
        <p
          ref={stratsLabelRef}
          className={cn(
            "mt-20 text-center text-xs font-medium uppercase tracking-[0.15em] text-[#7A7870] transition-all duration-700",
            stratsLabelVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          {t("combos.strategiesLabel")}
        </p>

        <div
          ref={stratsRef}
          className={cn(
            "mx-auto mt-6 flex max-w-4xl flex-wrap justify-center gap-2 transition-all duration-700 delay-100",
            stratsVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          {strategies.map((s) => (
            <div
              key={s.name}
              className="flex items-center gap-1.5 rounded-full border border-[rgba(15,15,14,0.08)] bg-white px-3 py-1.5 text-[12px] font-medium text-[#3A3A37] transition-colors hover:border-[rgba(15,15,14,0.15)] hover:text-[#0F0F0E]"
            >
              <s.icon className="h-3 w-3 text-[#7A7870]" />
              {s.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
