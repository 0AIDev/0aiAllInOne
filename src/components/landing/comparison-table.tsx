"use client";import { useLocale } from "@/i18n/locale-provider";

import React from "react";
import { cn } from "@/lib/utils/cn";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

type CellValue = string;

interface ComparisonRow {
  feature: string;
  ai0fy: CellValue;
  openrouter: CellValue;
  litellm: CellValue;
  cliproxy: CellValue;
}

interface RowGroup {
  name: string;
  rows: ComparisonRow[];
}

const groups: RowGroup[] = [
  {
    name: "Routing",
    rows: [
      { feature: "Providers", ai0fy: "290+", openrouter: "290+", litellm: "100+", cliproxy: "\u2014" },
      { feature: "Strategies", ai0fy: "18+", openrouter: "Custom", litellm: "5+", cliproxy: "1" },
      { feature: "Auto-fallback", ai0fy: "\u2713", openrouter: "\u2713", litellm: "\u2713", cliproxy: "\u2014" },
      { feature: "Load balancing", ai0fy: "\u2713", openrouter: "\u2014", litellm: "\u2713", cliproxy: "~" },
      { feature: "Quota-aware routing", ai0fy: "\u2713", openrouter: "\u2014", litellm: "\u2014", cliproxy: "\u2014" },
      { feature: "Weighted strategies", ai0fy: "\u2713", openrouter: "\u2014", litellm: "\u2014", cliproxy: "\u2014" },
    ],
  },
  {
    name: "Compression",
    rows: [
      { feature: "Prompt compression engine", ai0fy: "\u2713", openrouter: "\u2014", litellm: "\u2014", cliproxy: "\u2014" },
      { feature: "Token savings", ai0fy: "15\u201395%", openrouter: "\u2014", litellm: "\u2014", cliproxy: "\u2014" },
    ],
  },
  {
    name: "Protocols & Agents",
    rows: [
      { feature: "MCP server", ai0fy: "\u2713", openrouter: "\u2014", litellm: "\u2014", cliproxy: "\u2014" },
      { feature: "A2A server", ai0fy: "\u2713", openrouter: "\u2014", litellm: "\u2014", cliproxy: "\u2014" },
      { feature: "Cloud agent support", ai0fy: "~", openrouter: "\u2014", litellm: "\u2014", cliproxy: "\u2713" },
      { feature: "Format translator", ai0fy: "\u2713", openrouter: "~", litellm: "\u2713", cliproxy: "~" },
    ],
  },
  {
    name: "Resilience",
    rows: [
      { feature: "Circuit breakers", ai0fy: "\u2713", openrouter: "\u2014", litellm: "\u2014", cliproxy: "\u2014" },
      { feature: "Connection cooldown", ai0fy: "\u2713", openrouter: "\u2014", litellm: "~", cliproxy: "\u2014" },
      { feature: "Model lockout", ai0fy: "\u2713", openrouter: "\u2014", litellm: "\u2014", cliproxy: "\u2014" },
      { feature: "Session affinity", ai0fy: "\u2713", openrouter: "\u2014", litellm: "\u2014", cliproxy: "\u2014" },
    ],
  },
  {
    name: "Security & Observability",
    rows: [
      { feature: "PII redaction", ai0fy: "\u2713", openrouter: "\u2014", litellm: "\u2014", cliproxy: "\u2014" },
      { feature: "Prompt injection guardrails", ai0fy: "\u2713", openrouter: "\u2014", litellm: "\u2014", cliproxy: "\u2014" },
      { feature: "Vision content filter", ai0fy: "\u2713", openrouter: "\u2014", litellm: "\u2014", cliproxy: "\u2014" },
      { feature: "Audit logging", ai0fy: "\u2713", openrouter: "~", litellm: "~", cliproxy: "~" },
      { feature: "OpenTelemetry tracing", ai0fy: "\u2713", openrouter: "\u2014", litellm: "~", cliproxy: "\u2014" },
      { feature: "Webhook notifications", ai0fy: "\u2713", openrouter: "\u2014", litellm: "\u2014", cliproxy: "\u2014" },
    ],
  },
  {
    name: "Platform",
    rows: [
      { feature: "Multi-tenant", ai0fy: "\u2713", openrouter: "\u2014", litellm: "~", cliproxy: "\u2014" },
      { feature: "Stripe billing", ai0fy: "\u2713", openrouter: "\u2014", litellm: "\u2014", cliproxy: "\u2014" },
      { feature: "Dashboard", ai0fy: "\u2713", openrouter: "\u2713", litellm: "\u2713", cliproxy: "\u2713" },
      { feature: "Virtual keys with budget", ai0fy: "\u2713", openrouter: "\u2014", litellm: "\u2713", cliproxy: "\u2014" },
      { feature: "OAuth provider support", ai0fy: "\u2713", openrouter: "\u2014", litellm: "\u2014", cliproxy: "\u2713" },
      { feature: "i18n", ai0fy: "\u2713", openrouter: "\u2014", litellm: "\u2014", cliproxy: "\u2014" },
      { feature: "Self-hosted", ai0fy: "\u2713", openrouter: "\u2014", litellm: "\u2713", cliproxy: "\u2713" },
      { feature: "License", ai0fy: "BSL", openrouter: "Prop.", litellm: "MIT", cliproxy: "MIT" },
      { feature: "Stack", ai0fy: "TS/Next", openrouter: "\u2014", litellm: "Python", cliproxy: "Go" },
    ],
  },
];

const columns = ["Feature", "AI0FY", "OpenRouter", "LiteLLM", "CLIProxy"] as const;

function cellColor(colIdx: number, _value: string) {
  if (colIdx === 0) return "text-[#0F0F0E] font-medium";
  if (colIdx === 1) return "bg-[rgba(15,15,14,0.03)] text-[#0F0F0E] font-medium";
  return "text-[#3A3A37]";
}

export function ComparisonTable() {
  const { t } = useLocale();
  const { ref: tagRef, isVisible: tagVisible } = useScrollReveal();
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
  const { ref: subRef, isVisible: subVisible } = useScrollReveal();
  const { ref: tableRef, isVisible: tableVisible } = useScrollReveal({
    threshold: 0.03,
  });

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
          {t("comparison.tag")}
        </p>

        {/* Title */}
        <h2
          ref={titleRef}
          className={cn(
            "mt-5 text-center text-[clamp(32px,5vw,48px)] font-medium leading-[1.15] tracking-[-0.02em] text-[#0F0F0E] transition-all duration-700 delay-100",
            titleVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
          style={{ fontFamily: "'Inter Tight', sans-serif" }}
        >
          {t("comparison.title")}{" "}
          <em
            className="italic"
            style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
          >
            {t("comparison.titleEmphasis")}
          </em>
        </h2>

        {/* Subtitle */}
        <p
          ref={subRef}
          className={cn(
            "mx-auto mt-4 max-w-xl text-center text-[18px] leading-relaxed text-[#3A3A37] transition-all duration-700 delay-200",
            subVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          {t("comparison.subtitle")}
        </p>

        {/* Table */}
        <div
          ref={tableRef}
          className={cn(
            "mt-14 overflow-x-auto transition-all duration-700 delay-300",
            tableVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          <div className="inline-block min-w-full rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white">
            <table className="min-w-full border-collapse">
              {/* Header */}
              <thead>
                <tr>
                  {columns.map((col, ci) => (
                    <th
                      key={col}
                      className={cn(
                        "px-5 py-3.5 text-left text-xs font-medium uppercase tracking-[0.08em] bg-[#F1EFE9]",
                        ci === 0
                          ? "text-[#0F0F0E] rounded-tl-[14px]"
                          : ci === 1
                          ? "text-[#0F0F0E]"
                          : ci === columns.length - 1
                          ? "text-[#7A7870] rounded-tr-[14px]"
                          : "text-[#7A7870]"
                      )}
                      style={{ fontFamily: "'Inter Tight', sans-serif" }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body with groups */}
              <tbody>
                {groups.map((group, gi) => (
                  <React.Fragment key={`group-${group.name}`}>
                    {/* Group header row */}
                    <tr>
                      <td
                        colSpan={columns.length}
                        className={cn(
                          "px-5 py-2.5 text-xs font-medium uppercase tracking-[0.1em]",
                          gi !== 0 ? "border-t border-[rgba(15,15,14,0.08)]" : "",
                          "text-[#7A7870] bg-[rgba(15,15,14,0.02)]"
                        )}
                      >
                        {group.name}
                      </td>
                    </tr>
                    {/* Data rows */}
                    {group.rows.map((row) => (
                      <tr
                        key={`${group.name}-${row.feature}`}
                        className="border-t border-[rgba(15,15,14,0.06)]"
                      >
                        <td
                          className="px-5 py-3 text-sm font-medium text-[#0F0F0E]"
                          style={{ fontFamily: "'Inter Tight', sans-serif" }}
                        >
                          {row.feature}
                        </td>
                        <td
                          className={cn(
                            "px-5 py-3 text-sm",
                            cellColor(1, row.ai0fy)
                          )}
                        >
                          {row.ai0fy}
                        </td>
                        <td
                          className={cn(
                            "px-5 py-3 text-sm",
                            cellColor(2, row.openrouter)
                          )}
                        >
                          {row.openrouter}
                        </td>
                        <td
                          className={cn(
                            "px-5 py-3 text-sm",
                            cellColor(3, row.litellm)
                          )}
                        >
                          {row.litellm}
                        </td>
                        <td
                          className={cn(
                            "px-5 py-3 text-sm",
                            cellColor(4, row.cliproxy)
                          )}
                        >
                          {row.cliproxy}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footnote */}
        <p className="mt-4 text-center text-xs text-[#7A7870]">
          {t("comparison.footnote")}
        </p>
      </div>
    </section>
  );
}
