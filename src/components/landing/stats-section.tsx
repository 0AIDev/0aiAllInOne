"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useLocale } from "@/i18n/locale-provider";

interface StatItem {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  unit?: string;
  decimals?: number;
  transKey: string;
}

const stats: StatItem[] = [
  { value: 290, suffix: "+", label: "PROVIDERS", unit: "Providers", transKey: "stats.providers" },
  { value: 99.9, suffix: "%", label: "UPTIME SLA", unit: "Uptime", decimals: 1, transKey: "stats.uptime" },
  { value: 10, prefix: "<", suffix: "ms", label: "AVG ROUTING", unit: "ms", transKey: "stats.avgRouting" },
  { value: 0, prefix: "$", label: "TO START", unit: "To Start", transKey: "stats.toStart" },
];

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function AnimatedCounter({
  target,
  decimals = 0,
  duration = 2000,
  prefix,
  suffix,
}: {
  target: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [current, setCurrent] = useState(0);
  const { ref, isVisible } = useScrollReveal({ threshold: 0.3 });
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible) {
      setCurrent(0);
      return;
    }

    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      setCurrent(eased * target);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setCurrent(target);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [isVisible, target, duration]);

  const formatted = current.toFixed(decimals);

  return (
    <div ref={ref}>
      <span
        className="text-[44px] font-medium tracking-[-0.02em] text-[#0F0F0E]"
        style={{ fontFamily: "'Inter Tight', sans-serif" }}
      >
        {prefix}
        {formatted}
      </span>
      {suffix && (
        <em
          className="text-[36px] italic text-[#3A3A37]"
          style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
        >
          {suffix}
        </em>
      )}
    </div>
  );
}

export function StatsSection() {
  const { t } = useLocale();
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal({
    threshold: 0.05,
  });

  return (
    <section
      ref={sectionRef}
      className={cn(
        "border-b border-[rgba(15,15,14,0.08)] bg-white py-16 transition-all duration-700 sm:py-20",
        sectionVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 divide-x divide-[rgba(15,15,14,0.08)] sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1.5 px-4 py-2">
              <AnimatedCounter
                target={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                decimals={stat.decimals}
              />
              <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#7A7870]">
                {t(stat.transKey)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
