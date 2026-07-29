"use client";import { useLocale } from "@/i18n/locale-provider";

import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const tools = [
  { name: "Claude Code", domain: "claude.ai" },
  { name: "Codex", domain: "openai.com" },
  { name: "Cursor", domain: "cursor.com" },
  { name: "Cline", domain: "cline.bot" },
  { name: "GitHub Copilot", domain: "github.com" },
  { name: "Gemini CLI", domain: "gemini.google.com" },
  { name: "OpenCode", domain: "opencode.ai" },
  { name: "Kilo Code", domain: "kilocode.ai" },
  { name: "Droid", domain: "factory.ai" },
  { name: "Continue", domain: "continue.dev" },
  { name: "Roo Code", domain: "roocode.com" },
  { name: "Antigravity", domain: "antigravity.google" },
];

const getFaviconUrl = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

function ToolCard({
  name,
  domain,
  index,
}: {
  name: string;
  domain: string;
  index: number;
}) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={cn(
        "group flex items-center gap-3 rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white px-4 py-3.5 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(15,15,14,0.06)]",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      )}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[8px] bg-[rgba(15,15,14,0.04)] overflow-hidden">
        <Image
          src={getFaviconUrl(domain)}
          alt={name}
          width={16}
          height={16}
          className="h-4 w-4 object-contain"
          unoptimized
        />
      </div>
      <span
        className="text-sm font-medium tracking-[-0.01em] text-[#0F0F0E]"
        style={{ fontFamily: "'Inter Tight', sans-serif" }}
      >
        {name}
      </span>
    </div>
  );
}

export function CompatibleTools() {
  const { t } = useLocale();
  const { ref: tagRef, isVisible: tagVisible } = useScrollReveal();
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
  const { ref: subRef, isVisible: subVisible } = useScrollReveal();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal({
    threshold: 0.05,
  });
  const { ref: codeRef, isVisible: codeVisible } = useScrollReveal();

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Tag */}
        <p
          ref={tagRef}
          className={cn(
            "text-center text-xs font-medium uppercase tracking-[0.15em] text-[#7A7870] transition-all duration-700",
            tagVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          {t("compatible.tag")}
        </p>

        {/* Title */}
        <h2
          ref={titleRef}
          className={cn(
            "mt-5 text-center text-[clamp(32px,5vw,48px)] font-medium leading-[1.15] tracking-[-0.02em] text-[#0F0F0E] transition-all duration-700 delay-100",
            titleVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          )}
          style={{ fontFamily: "'Inter Tight', sans-serif" }}
        >
          {t("compatible.title")}{" "}
          <em
            className="italic"
            style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
          >
            {t("compatible.titleEmphasis")}
          </em>{" "}
          works.
        </h2>

        {/* Subtitle */}
        <p
          ref={subRef}
          className={cn(
            "mx-auto mt-4 max-w-2xl text-center text-[18px] leading-relaxed text-[#3A3A37] transition-all duration-700 delay-200",
            subVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          )}
        >
          {t("compatible.subtitle")}
        </p>

        {/* Tool cards grid */}
        <div
          ref={gridRef}
          className={cn(
            "mt-14 grid grid-cols-2 gap-3 transition-all duration-700 delay-300 sm:grid-cols-3 lg:grid-cols-4",
            gridVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          )}
        >
          {tools.map((tool, idx) => (
            <ToolCard key={tool.name} name={tool.name} domain={tool.domain} index={idx} />
          ))}
        </div>

        {/* Apple-style terminal */}
        <div
          ref={codeRef}
          className={cn(
            "mx-auto mt-12 max-w-lg transition-all duration-700 delay-500",
            codeVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          <div className="overflow-hidden rounded-xl bg-[#1a1a1a] shadow-2xl shadow-black/20">
            {/* Title bar */}
            <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-[#2d2d2d] px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
              <div className="h-3 w-3 rounded-full bg-[#28CA41]" />
              <span className="ml-3 text-[11px] font-medium text-white/30">
                Terminal
              </span>
            </div>
            {/* Body */}
            <div className="px-5 py-5">
              <p className="mb-3 font-mono text-xs text-white/30">
                # Configure your AI tool to use AIStack:
              </p>
              <code className="block font-mono text-sm leading-relaxed text-white">
                <span className="text-[#FFBD2E]">export</span>{" "}
                <span className="text-[#5AF78E]">OPENAI_BASE_URL</span>
                <span className="text-white">=</span>
                <span className="text-[#57C7FF]">https://api.aistack.dev/v1</span>
              </code>
              <p className="mt-4 font-mono text-xs text-white/20">
                {t("compatible.note")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
