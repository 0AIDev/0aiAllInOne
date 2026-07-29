import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArrowDown, Github, Terminal } from "lucide-react";
import Link from "next/link";

const RELEASE_URL = "/downloads";

export const metadata: Metadata = {
  title: "Download - AI0FY",
  description: "Download the AI0FY desktop app or CLI for Windows, macOS, and Linux.",
};

const platforms = [
  {
    name: "Windows",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#0078D4"><path d="M0 0h11.5v11.5H0V0zm12.5 0H24v11.5H12.5V0zM0 12.5h11.5V24H0V12.5zm12.5 0H24V24H12.5V12.5z"/></svg>`,
    desc: "Windows 10+ (x64)",
    fileName: "AI0FY_1.0.0_x64-setup.exe",
  },
  {
    name: "macOS",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M17.9 12.6c.1 3.7 3.3 5 3.4 5s-.5 1.7-1.7 3.4c-1 1.4-2.1 2.8-3.8 2.8-1.6 0-2.2-.9-4-.9-1.9 0-2.5 1-4 1-1.6 0-2.7-1.3-3.8-2.8C2.4 18.3 1.2 14.9 1.3 11.5c0-4.3 2.8-6.4 5.5-6.4 1.6 0 3 1.1 4 1.1 1 0 2.6-1.2 4.4-1 1.2 0 4.6.5 5.4 3.4-.1 0-3.2 1.9-3.1 5.6zM14.4 3.6c.8-1 1.4-2.4 1.2-3.6-1.2 0-2.6.8-3.5 1.8-.8.9-1.5 2.4-1.3 3.8 1.4.1 2.8-.7 3.6-2z"/></svg>`,
    desc: "macOS 12+ (Intel & Apple Silicon)",
    fileName: "AI0FY_1.0.0_x64.dmg",
  },
  {
    name: "Linux",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#E95420"/><path d="M12.2 15c-1.9 0-3.4-1.5-3.4-3.4 0-1.9 1.5-3.4 3.4-3.4 1.9 0 3.4 1.5 3.4 3.4 0 1.9-1.5 3.4-3.4 3.4zm0-5.1c-.9 0-1.7.8-1.7 1.7s.8 1.7 1.7 1.7 1.7-.8 1.7-1.7-.8-1.7-1.7-1.7z" fill="#fff"/></svg>`,
    desc: "Ubuntu 20.04+ / Debian 11+ (x64)",
    fileName: "AI0FY_1.0.0_amd64.deb",
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
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[rgba(15,15,14,0.04)]" dangerouslySetInnerHTML={{ __html: p.icon }} />
                  <p className="mt-3 font-medium text-[#0F0F0E]">{p.name}</p>
                  <p className="mt-0.5 text-sm text-[#7A7870]">{p.desc}</p>
                  <div className="mt-6">
                    <a
                      href={`${RELEASE_URL}/${p.fileName}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#0F0F0E] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3A3A37]"
                    >
                      <ArrowDown className="h-4 w-4" />
                      Download for {p.name}
                    </a>
                  </div>
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
