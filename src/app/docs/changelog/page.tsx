import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Changelog - AIStack",
  description: "Latest updates and improvements to AIStack.",
};

const entries = [
  {
    version: "v1.2.0",
    date: "June 22, 2026",
    changes: [
      "Added prompt compression support for Anthropic Claude models",
      "New dashboard analytics with per-provider breakdown",
      "Improved fallback latency — sub-200ms failover",
      "Webhook retry with exponential backoff (max 5 retries)",
      "Rate limit headers now include remaining quota",
    ],
  },
  {
    version: "v1.1.0",
    date: "June 8, 2026",
    changes: [
      "Introduced multi-tenant architecture with isolated sub-accounts",
      "Added guardrails API for content moderation",
      "New SDKs: TypeScript, Python, Go (beta)",
      "Streaming responses now support multiple fallback providers",
      "Updated OpenAPI spec to 3.1.0",
    ],
  },
  {
    version: "v1.0.0",
    date: "May 25, 2026",
    changes: [
      "Stable release of AIStack universal AI gateway",
      "Support for 290+ AI providers with auto-discovery",
      "Automatic multi-provider fallback on errors and rate limits",
      "Prompt compression reducing tokens by up to 60%",
      "Per-tenant rate limiting and usage tracking",
      "Dashboard with real-time metrics and logs",
    ],
  },
  {
    version: "v0.9.0",
    date: "May 10, 2026",
    changes: [
      "Public beta launch",
      "Initial provider support: OpenAI, Anthropic, Google, Cohere, Mistral",
      "Basic fallback routing with manual provider selection",
      "Simple usage dashboard",
    ],
  },
  {
    version: "v0.5.0",
    date: "April 18, 2026",
    changes: [
      "Internal alpha release",
      "Core routing engine for single-provider requests",
      "API key authentication and management",
      "Basic rate limiting",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <>
      <Navbar user={null} />
      <div className="bg-[#F9F9F6]">
        <main>
          <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
            <h1
              className="text-[clamp(32px,5vw,48px)] font-medium leading-[1.1] tracking-[-0.02em] text-[#0F0F0E]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              <em
                className="italic"
                style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
              >
                Changelog
              </em>
            </h1>
            <p className="mt-4 text-lg text-[#3A3A37]">
              Track every update, improvement, and fix shipped to AIStack.
            </p>

            <div className="mt-12 space-y-8">
              {entries.map((entry) => (
                <div
                  key={entry.version}
                  className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-lg font-medium text-[#0F0F0E]">{entry.version}</h2>
                    <span className="shrink-0 text-sm text-[#7A7870]">{entry.date}</span>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {entry.changes.map((change, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#3A3A37]">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F0F0E]" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
