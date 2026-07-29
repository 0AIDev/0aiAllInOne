import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Terminal, MessageSquare, FileText, List, BarChart3, Eye, ArrowRight, Github, Download, Monitor, Zap } from "lucide-react";
import { CopyButton } from "./CopyButton";

export const metadata: Metadata = {
  title: "CLI - AIStack",
  description: "290+ providers from your terminal. One command to rule them all.",
};

const commands = [
  { icon: Terminal, name: "aistack init", desc: "Step-by-step wizard. Set your API key, pick a default model, and configure compression.", flags: "" },
  { icon: MessageSquare, name: "aistack chat", desc: "Interactive chat with streaming. See which provider served each response and the latency.", flags: '--model auto/coding --system "You are a senior engineer"' },
  { icon: Zap, name: "aistack run", desc: "One-shot prompt. Pipe stdin for file input. Returns clean output — ideal for scripts.", flags: '"Summarize this log" --model gpt-4o' },
  { icon: FileText, name: "aistack stream", desc: "Token-by-token streaming. Watch tokens arrive in real time with live cost estimates.", flags: '"Write a haiku about code" --model claude-4' },
  { icon: List, name: "aistack models", desc: "Browse the full catalog. Filter by provider, search by name, or show only free models.", flags: "--search gpt --free-only --json" },
  { icon: BarChart3, name: "aistack benchmark", desc: "Compare models head-to-head. Measure latency, token count, and cost across multiple runs.", flags: '"Fix this bug" --models gpt-4o,claude-4 --runs 5' },
  { icon: Eye, name: "aistack watch", desc: "Real-time dashboard in your terminal. See requests, fallbacks, and health at a glance.", flags: "" },
  { icon: Monitor, name: "aistack providers", desc: "List every connected provider by category. Check status, quota, and connection health.", flags: "--category free --search openai" },
  { icon: FileText, name: "aistack compress", desc: "Preview how much you save before sending. RTK + Caveman compression in one command.", flags: "paste text here --level aggressive" },
];

export default function CLIPage() {
  return (
    <>
      <Navbar user={null} />
      <div className="bg-[#F9F9F6]">
        <main>
          {/* Hero */}
          <section className="px-4 pt-24 pb-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#7A7870]">CLI</p>
              <h1 className="mt-4 text-[clamp(36px,6vw,64px)] font-medium leading-[1.1] tracking-[-0.02em] text-[#0F0F0E]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                AIStack{" "}
                <em className="italic" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>CLI</em>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-[18px] leading-relaxed text-[#3A3A37]">
                290+ providers from your terminal. Install once, access every AI model with a single command.
              </p>

              <div className="mx-auto mt-10 max-w-xl space-y-4">
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#7A7870]">Install in seconds</p>
                <div className="flex items-center gap-0 rounded-xl border border-[rgba(15,15,14,0.08)] bg-white p-1.5 shadow-[0_8px_30px_-12px_rgba(15,15,14,0.1)]">
                  <span className="select-none px-4 py-2.5 text-sm font-medium text-[#7A7870]">$</span>
                  <code className="flex-1 truncate py-2.5 text-sm font-medium text-[#0F0F0E]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                    curl -fsSL https://cli.aistack.dev/install.sh | bash
                  </code>
                  <CopyButton text="curl -fsSL https://cli.aistack.dev/install.sh | bash" />
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-[#7A7870]">
                  <span>or</span>
                  <code className="rounded-md bg-[rgba(15,15,14,0.05)] px-2.5 py-1 font-medium text-[#0F0F0E]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>npm i -g aistack-cli</code>
                  <span>or</span>
                  <code className="rounded-md bg-[rgba(15,15,14,0.05)] px-2.5 py-1 font-medium text-[#0F0F0E]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>brew install aistack</code>
                </div>
              </div>
            </div>
          </section>

          {/* Setup wizard highlight */}
          <section className="py-12 sm:py-16">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-8 text-center">
                <Download className="mx-auto h-8 w-8 text-[#0F0F0E]" />
                <h2 className="mt-4 text-xl font-semibold text-[#0F0F0E]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                  Interactive Setup Wizard
                </h2>
                <p className="mt-2 text-sm text-[#3A3A37]">
                  Run <code className="rounded bg-[rgba(15,15,14,0.06)] px-1.5 py-0.5 text-xs font-medium text-[#0F0F0E]">aistack setup</code> for a beautiful TUI that walks you through authentication, provider connections, API key generation, and environment export. No browser needed.
                </p>
              </div>
            </div>
          </section>

          {/* Commands */}
          <section className="py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <p className="text-center text-xs font-medium uppercase tracking-[0.15em] text-[#7A7870]">Commands</p>
              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {commands.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <div key={cmd.name} className="flex items-start gap-4 rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(15,15,14,0.06)]">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(15,15,14,0.04)]">
                        <Icon className="h-5 w-5 text-[#0F0F0E]" />
                      </div>
                      <div className="min-w-0">
                        <code className="text-sm font-semibold text-[#0F0F0E]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>{cmd.name}</code>
                        <p className="mt-1.5 text-sm leading-relaxed text-[#3A3A37]">{cmd.desc}</p>
                        {cmd.flags && (
                          <code className="mt-2 inline-block rounded-md bg-[rgba(15,15,14,0.05)] px-2.5 py-1 text-xs text-[#7A7870]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                            {cmd.flags}
                          </code>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Terminal example */}
          <section className="py-16 sm:py-24">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <p className="text-center text-xs font-medium uppercase tracking-[0.15em] text-[#7A7870]">Example Session</p>
              <div className="mt-8 overflow-hidden rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-[#0F0F0E]">
                <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                  <span className="ml-3 text-[11px] text-white/40">Terminal — aistack v1.0</span>
                </div>
                <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                  <code>
                    <span className="text-white/30"># Install the CLI</span>{"\n"}
                    <span className="text-[#10b981]">$</span> <span className="text-white/80">curl -fsSL https://cli.aistack.dev/install.sh | bash</span>{"\n\n"}
                    <span className="text-white/30"># Login to your account</span>{"\n"}
                    <span className="text-[#10b981]">$</span> <span className="text-white/80">aistack init</span>{"\n"}
                    <span className="text-white/50">  Enter API key: ************</span>{"\n"}
                    <span className="text-white/50">  ✓ Configuration saved to ~/.aistack/config.json</span>{"\n\n"}
                    <span className="text-white/30"># Chat interactively</span>{"\n"}
                    <span className="text-[#10b981]">$</span> <span className="text-white/80">aistack chat --model auto</span>{"\n"}
                    <span className="text-white/50">  You: Explain quantum computing in 3 sentences</span>{"\n"}
                    <span className="text-[#5AF78E]">  AI: Quantum computing uses qubits instead of bits...</span>{"\n"}
                    <span className="text-white/30">  ✓ openai/gpt-4o — 1.24s — 42 tokens</span>{"\n\n"}
                    <span className="text-white/30"># Run a single prompt (pipe-friendly)</span>{"\n"}
                    <span className="text-[#10b981]">$</span> <span className="text-white/60">cat logs.txt</span> <span className="text-white/80">| aistack run</span> <span className="text-[#e9b44c]">&quot;Find all errors in these logs&quot;</span>{"\n\n"}
                    <span className="text-white/30"># List models and filter</span>{"\n"}
                    <span className="text-[#10b981]">$</span> <span className="text-white/80">aistack models --search gpt --free-only</span>{"\n\n"}
                    <span className="text-white/30"># Benchmark across models</span>{"\n"}
                    <span className="text-[#10b981]">$</span> <span className="text-white/80">aistack benchmark &quot;Write a sorting function&quot; --models auto --runs 10</span>{"\n\n"}
                    <span className="text-white/30"># Live usage monitor</span>{"\n"}
                    <span className="text-[#10b981]">$</span> <span className="text-white/80">aistack watch</span>
                  </code>
                </pre>
              </div>
            </div>
          </section>

          {/* GitHub */}
          <section className="pb-24 pt-8 sm:pb-32 sm:pt-16">
            <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
              <div className="rounded-[20px] border border-[rgba(15,15,14,0.08)] bg-white px-8 py-12 sm:px-12 sm:py-16">
                <Github className="mx-auto h-10 w-10 text-[#0F0F0E]" />
                <h2 className="mt-5 text-2xl font-medium tracking-[-0.01em] text-[#0F0F0E]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>Open source</h2>
                <p className="mt-3 text-[16px] leading-relaxed text-[#3A3A37]">The AIStack CLI is fully open source. Star it, fork it, contribute.</p>
                <Link href="https://github.com/aistack/cli" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-white px-6 py-3 text-sm font-medium text-[#0F0F0E] transition-colors hover:bg-[rgba(15,15,14,0.03)]">
                  <Github className="h-4 w-4" /> View on GitHub <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
