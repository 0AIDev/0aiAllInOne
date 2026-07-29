import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArrowDown, Github, Terminal, Monitor } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Download - AI0FY",
  description: "Download the AI0FY desktop app or CLI for Windows, macOS, and Linux.",
};

const platforms = [
  {
    name: "Windows",
    icon: Monitor,
    desc: "Windows 10+ (x64)",
    msi: "AI0FY_1.0.0_x64.msi",
    exe: "AI0FY_1.0.0_x64.exe",
  },
  {
    name: "macOS",
    icon: Monitor,
    desc: "macOS 12+ (Intel & Apple Silicon)",
    dmg: "AI0FY_1.0.0_x64.dmg",
  },
  {
    name: "Linux",
    icon: Monitor,
    desc: "Ubuntu 20.04+ / Debian 11+ (x64)",
    deb: "AI0FY_1.0.0_amd64.deb",
  },
];

export default function DownloadPage() {
  return (
    <>
      <Navbar user={null} />
      <div className="bg-[#F9F9F6]">
        <main>
          <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1
                className="text-[clamp(32px,5vw,48px)] font-medium leading-[1.1] tracking-[-0.02em] text-[#0F0F0E]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                Download{" "}
                <em className="italic" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
                  AI0FY
                </em>
              </h1>
              <p className="mt-4 text-lg text-[#3A3A37]">
                Native desktop app for Windows, macOS, and Linux. No browser needed.
              </p>
            </div>

            {/* Desktop App Cards */}
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {platforms.map((p) => (
                <div key={p.name} className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6 text-center transition-all hover:shadow-md">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(15,15,14,0.04)]">
                    <p className="text-base font-bold text-[#3A3A37]">{p.name}</p>
                  </div>
                  <p className="mt-3 text-sm text-[#7A7870]">{p.desc}</p>
                  <div className="mt-6 space-y-2">
                    <a
                      href={`https://github.com/0AIDev/0aiAllInOne/releases/download/v1.0.0/${p.msi || p.dmg || p.deb || "#"}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#0F0F0E] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3A3A37]"
                      target={p.msi ? undefined : "_blank"}
                    >
                      <ArrowDown className="h-4 w-4" />
                      Download for {p.name}
                    </a>
                  </div>
                  <p className="mt-3 text-[11px] text-[#7A7870]">
                    {p.msi ? ".msi installer" : p.dmg ? ".dmg disk image" : ".deb package"}
                  </p>
                </div>
              ))}
            </div>

            {/* CLI Option */}
            <div className="mt-12 rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-8">
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[rgba(15,15,14,0.04)]">
                  <Terminal className="h-6 w-6 text-[#0F0F0E]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-medium text-[#0F0F0E]">
                    CLI — Terminal Version
                  </h2>
                  <p className="mt-1 text-sm text-[#7A7870]">
                    For developers who prefer the terminal. Chat, stream, benchmark, and monitor directly from your shell.
                  </p>
                  <div className="mt-4 rounded-[10px] bg-[#F1EFE9] px-4 py-3 text-sm font-mono text-[#0F0F0E]">
                    npm install -g @ai0fy/cli
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link href="/cli" className="inline-flex items-center gap-2 rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-white px-4 py-2 text-sm font-medium text-[#0F0F0E] transition-colors hover:bg-[rgba(15,15,14,0.03)]">
                      <Terminal className="h-4 w-4" />
                      CLI Documentation
                    </Link>
                    <a
                      href="https://www.npmjs.com/package/@ai0fy/cli"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-white px-4 py-2 text-sm font-medium text-[#0F0F0E] transition-colors hover:bg-[rgba(15,15,14,0.03)]"
                    >
                      <Github className="h-4 w-4" />
                      npm Package
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* GitHub Release */}
            <div className="mt-8 text-center">
              <p className="text-sm text-[#7A7870]">
                All releases are signed and published on{" "}
                <a
                  href="https://github.com/0AIDev/0aiAllInOne/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#0F0F0E] underline underline-offset-4"
                >
                  GitHub Releases
                </a>
                .
              </p>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
