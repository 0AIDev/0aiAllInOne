import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Smart Combos - AIStack",
  description: "19 routing strategies. Set your model to auto and let AIStack build a virtual combo from your connected providers.",
};

const strategies = [
  { number: "01", name: "priority", emoji: "🎯", description: "Try providers in a strict priority order. If the first fails or is exhausted, move to the next. Simple and predictable." },
  { number: "02", name: "fill-first", emoji: "🪣", description: "Send all requests to the first provider until its quota is fully depleted, then switch to the next. Maximizes utilization before moving on." },
  { number: "03", name: "weighted", emoji: "⚖️", description: "Distribute requests proportionally based on assigned weights. Give more traffic to faster, cheaper, or preferred providers." },
  { number: "04", name: "round-robin", emoji: "🔄", description: "Cycle through providers evenly. Each gets an equal number of requests in sequence. Fair and stateless." },
  { number: "05", name: "p2c", emoji: "⚡", description: "Power of two choices. Randomly pick two providers and route to the one with fewer in-flight requests. Optimal load balancing." },
  { number: "06", name: "least-used", emoji: "📉", description: "Route to the provider with the lowest current request count. Keeps the load spread evenly across all available providers." },
  { number: "07", name: "random", emoji: "🎲", description: "Randomly select a provider for each request. Simple entropy-based distribution that works well at scale." },
  { number: "08", name: "strict-random", emoji: "🔀", description: "Random selection that respects quota limits. If the chosen provider is out of quota, it skips rather than falling back." },
  { number: "09", name: "cost-optimized", emoji: "💸", description: "Always route to the cheapest provider that can handle the request. Minimizes cost without compromising availability." },
  { number: "10", name: "headroom", emoji: "📊", description: "Route to the provider with the most remaining quota and rate limit headroom. Prevents any single provider from getting throttled." },
  { number: "11", name: "reset-window", emoji: "⏱️", description: "Track provider rate-limit reset windows and avoid routing to providers about to hit their limit. Proactive throttling avoidance." },
  { number: "12", name: "reset-aware", emoji: "🔮", description: "Predict when rate limits will reset and schedule requests accordingly. Route to providers whose limits reset soonest." },
  { number: "13", name: "context-relay", emoji: "🔗", description: "Maintain conversation context across provider switches. When a fallback occurs, relay the full context to the next provider seamlessly." },
  { number: "14", name: "context-optimized", emoji: "🧠", description: "Optimize routing based on context window sizes. Match long-context requests to providers with the largest context windows." },
  { number: "15", name: "cache-optimized", emoji: "🚀", description: "Route identical or similar prompts to the same provider to maximize cache hit rates. Reduces latency and cost for repeated queries." },
  { number: "16", name: "lkgp", emoji: "🏆", description: "Last Known Good Provider. Routes to the most recently successful provider and sticks with it until it fails. The default auto strategy." },
  { number: "17", name: "auto (12-factor)", emoji: "🤖", description: "Live scoring across 12 factors — latency, cost, quota, reliability, context size, cache hit rate, throughput, error rate, freshness, load, quality, and availability." },
  { number: "18", name: "fusion", emoji: "🌀", description: "Send the same request to multiple providers in parallel and return the first successful response. For when latency is everything." },
  { number: "19", name: "pipeline", emoji: "🔧", description: "Chain providers together in a processing pipeline. Each provider handles a stage — pre-processing, generation, post-processing, validation." },
];

const presets = [
  { name: "auto", emoji: "⚖️", description: "Balanced default using LKGP strategy. Sticks to your last good provider and falls back intelligently on failure.", example: "gpt-5.1?model=auto" },
  { name: "auto/coding", emoji: "💻", description: "Quality-first weights optimized for code generation. Prioritizes providers with top coding benchmarks.", example: "gpt-5.1?model=auto/coding" },
  { name: "auto/fast", emoji: "⚡", description: "Lowest latency first. Routes to the fastest-responding providers for real-time experiences.", example: "gpt-5.1?model=auto/fast" },
  { name: "auto/cheap", emoji: "💸", description: "Cheapest per token first. Maximizes your budget by always picking the lowest-cost option.", example: "gpt-5.1?model=auto/cheap" },
  { name: "auto/offline", emoji: "📡", description: "Most quota and rate-limit headroom first. Keeps requests flowing even under heavy load.", example: "gpt-5.1?model=auto/offline" },
  { name: "auto/smart", emoji: "🧠", description: "Quality-first with 10% exploration budget. Discovers new models while maintaining quality.", example: "gpt-5.1?model=auto/smart" },
];

export default function CombosPage() {
  return (
    <>
      <Navbar user={null} />
      <div className="bg-[#F9F9F6]">
        <main>
          {/* Hero */}
          <section className="px-4 pt-24 pb-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h1
                className="text-[clamp(36px,6vw,64px)] font-medium leading-[1.1] tracking-[-0.02em] text-[#0F0F0E]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                Smart{" "}
                <em
                  className="italic"
                  style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
                >
                  Combos
                </em>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-[18px] leading-relaxed text-[#3A3A37]">
                One alias, 290+ providers behind it. AIStack&apos;s combo engine
                builds a virtual pipeline from your connected providers, scored
                live across 12 factors in real time.
              </p>
            </div>
          </section>

          {/* Strategies table */}
          <section className="py-16 sm:py-24">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <p className="text-center text-xs font-medium uppercase tracking-[0.15em] text-[#7A7870]">
                19 strategies
              </p>
              <p className="mx-auto mt-3 max-w-lg text-center text-[16px] leading-relaxed text-[#3A3A37]">
                Every routing strategy available in the combo engine. Mix, match,
                and compose them for any workload.
              </p>

              <div className="mt-12 overflow-hidden rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="w-16 px-5 py-3.5 text-left text-xs font-medium uppercase tracking-[0.08em] text-[#7A7870] bg-[#F1EFE9] rounded-tl-[14px]">
                          #
                        </th>
                        <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-[0.08em] text-[#7A7870] bg-[#F1EFE9]">
                          Strategy
                        </th>
                        <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-[0.08em] text-[#7A7870] bg-[#F1EFE9] rounded-tr-[14px]">
                          What it does
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {strategies.map((s, i) => (
                        <tr
                          key={s.name}
                          className={i !== 0 ? "border-t border-[rgba(15,15,14,0.06)]" : ""}
                        >
                          <td className="px-5 py-4 text-center text-sm font-medium text-[#7A7870]">
                            {s.number}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">{s.emoji}</span>
                              <code
                                className="text-sm font-semibold text-[#0F0F0E]"
                                style={{ fontFamily: "'Inter Tight', sans-serif" }}
                              >
                                {s.name}
                              </code>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm leading-relaxed text-[#3A3A37]">
                            {s.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Auto presets */}
          <section className="py-16 sm:py-24">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <p className="text-center text-xs font-medium uppercase tracking-[0.15em] text-[#7A7870]">
                Auto presets
              </p>
              <p className="mx-auto mt-3 max-w-lg text-center text-[16px] leading-relaxed text-[#3A3A37]">
                Six pre-configured virtual combos. Each tunes the 12-factor
                scoring engine for a specific workload — just append it to your
                model query.
              </p>

              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {presets.map((preset) => (
                  <div
                    key={preset.name}
                    className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(15,15,14,0.06)] sm:p-7"
                  >
                    <span className="text-2xl">{preset.emoji}</span>
                    <code
                      className="mt-4 block text-sm font-semibold text-[#0F0F0E]"
                      style={{ fontFamily: "'Inter Tight', sans-serif" }}
                    >
                      {preset.name}
                    </code>
                    <p className="mt-2 text-sm leading-relaxed text-[#3A3A37]">
                      {preset.description}
                    </p>
                    <div className="mt-4 rounded-lg bg-[rgba(15,15,14,0.04)] px-3 py-2">
                      <code className="text-[11px] font-medium text-[#7A7870]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                        {preset.example}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
