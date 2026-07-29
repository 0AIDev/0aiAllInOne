import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArrowRight, BookOpen, Code, Key, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation - AIStack",
  description: "AIStack API documentation. Quick start guides, API reference, and integration examples.",
};

const sections = [
  {
    title: "Quick Start",
    description: "Get up and running in 60 seconds. Create your account, get your API key, and make your first request.",
    icon: Zap,
    links: [
      { label: "Create an account", href: "/register" },
      { label: "Get your API key", href: "/dashboard/api-keys" },
      { label: "Make your first request", href: "#" },
    ],
  },
  {
    title: "API Reference",
    description: "Full OpenAPI 3.1 specification for the AIStack API. Drop-in compatible with the OpenAI SDK.",
    icon: Code,
    links: [
      { label: "OpenAPI Spec (JSON)", href: "/api/v1/openapi.json" },
      { label: "Chat Completions", href: "#" },
      { label: "List Models", href: "#" },
    ],
  },
  {
    title: "Authentication",
    description: "Learn how to authenticate your requests using API keys. All requests require a Bearer token.",
    icon: Key,
    links: [
      { label: "API Key authentication", href: "#" },
      { label: "Managing API keys", href: "/dashboard/api-keys" },
      { label: "Security best practices", href: "#" },
    ],
  },
  {
    title: "Guides",
    description: "Step-by-step guides for common integrations and workflows with AIStack.",
    icon: BookOpen,
    links: [
      { label: "OpenAI SDK integration", href: "#" },
      { label: "Streaming responses", href: "#" },
      { label: "Prompt compression guide", href: "#" },
      { label: "Multi-provider fallback", href: "#" },
    ],
  },
];

export default function DocsPage() {
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
              Documentation
            </em>
          </h1>
          <p className="mt-4 text-lg text-[#3A3A37]">
            Everything you need to integrate AIStack into your application.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {sections.map((section) => (
              <div
                key={section.title}
                className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(15,15,14,0.04)] text-[#0F0F0E]">
                  <section.icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-medium text-[#0F0F0E]">{section.title}</h2>
                <p className="mt-2 text-sm text-[#3A3A37]">{section.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0F0F0E] underline underline-offset-4 decoration-[rgba(15,15,14,0.15)] transition-colors hover:text-[#3A3A37]"
                      >
                        {link.label}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-8 text-center">
            <h2 className="text-xl font-medium text-[#0F0F0E]">Quick Start</h2>
            <p className="mt-2 text-sm text-[#3A3A37]">
              Copy this curl command to make your first API request.
            </p>
            <div className="mt-4 overflow-x-auto rounded-[10px] bg-[#0F0F0E] p-5 text-left">
              <code className="text-sm text-[#B8B5AE]">
                <span className="text-emerald-400">$</span> curl https://api.aistack.dev/v1/chat/completions \<br />
                {"  "}-H <span className="text-amber-300">&quot;Authorization: Bearer YOUR_API_KEY&quot;</span> \<br />
                {"  "}-H <span className="text-amber-300">&quot;Content-Type: application/json&quot;</span> \<br />
                {"  "}-d <span className="text-amber-300">&apos;{"{"}&quot;model&quot;: &quot;gpt-4o&quot;, &quot;messages&quot;: [{"{"}&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;Hello!&quot;{"}"}]{"}"}&apos;</span>
              </code>
            </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
