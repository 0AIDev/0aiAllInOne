import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArrowRight, Play, Zap, Shrink, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Guides - AI0FY",
  description: "Step-by-step guides for integrating AI0FY into your application.",
};

const guides = [
  {
    title: "Getting Started",
    description:
      "Create your account, get your API key, and make your first request to AI0FY in under 60 seconds.",
    icon: Play,
    href: "/docs/guides/getting-started",
  },
  {
    title: "Streaming Responses",
    description:
      "Learn how to stream AI responses in real-time using server-sent events (SSE) with AI0FY.",
    icon: Zap,
    href: "/docs/guides/streaming",
  },
  {
    title: "Prompt Compression",
    description:
      "Reduce token usage by up to 60% with AI0FY's built-in prompt compression. No code changes needed.",
    icon: Shrink,
    href: "/docs/guides/compression",
  },
  {
    title: "Multi-Provider Fallback",
    description:
      "Configure intelligent fallback routing across multiple AI providers for zero-downtime operations.",
    icon: Layers,
    href: "/docs/guides/multi-provider",
  },
];

export default function GuidesPage() {
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
                Guides
              </em>
            </h1>
            <p className="mt-4 text-lg text-[#3A3A37]">
              Step-by-step tutorials to help you integrate AI0FY into your application.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {guides.map((guide) => (
                <Link
                  key={guide.title}
                  href={guide.href}
                  className="group rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6 transition-all hover:border-[rgba(15,15,14,0.16)] hover:shadow-md"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(15,15,14,0.04)] text-[#0F0F0E]">
                    <guide.icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 text-lg font-medium text-[#0F0F0E]">{guide.title}</h2>
                  <p className="mt-2 text-sm text-[#3A3A37] leading-relaxed">
                    {guide.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#0F0F0E]">
                    Read more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
