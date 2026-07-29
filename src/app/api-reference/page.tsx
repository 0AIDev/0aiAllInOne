import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArrowRight, Code, Key, Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "API Reference - AIStack",
  description: "AIStack API reference. OpenAI-compatible chat completions endpoint with 30+ providers.",
};

export default function ApiReferencePage() {
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
              API
            </em>{" "}
            Reference
          </h1>
          <p className="mt-4 text-lg text-[#3A3A37]">
            OpenAI-compatible API. Drop-in replacement - just change the URL.
          </p>

          <div className="mt-12 space-y-8">
            <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6">
              <div className="mb-3 inline-flex items-center gap-2 font-medium text-[#0F0F0E]">
                <Terminal className="h-4 w-4" />
                Base URL
              </div>
              <code className="block rounded-[10px] bg-[#F1EFE9] px-4 py-3 text-sm text-[#3A3A37]">
                https://api.aistack.dev/v1
              </code>
            </div>

            <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6">
              <div className="mb-3 inline-flex items-center gap-2 font-medium text-[#0F0F0E]">
                <Key className="h-4 w-4" />
                Authentication
              </div>
              <p className="text-sm text-[#3A3A37]">
                All requests require a Bearer token. Get your API key from the{" "}
                <Link href="/dashboard/api-keys" className="underline underline-offset-4 hover:text-[#0F0F0E]">
                  dashboard
                </Link>.
              </p>
              <code className="mt-3 block rounded-[10px] bg-[#F1EFE9] px-4 py-3 text-sm text-[#3A3A37]">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>

            <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6">
              <div className="mb-3 inline-flex items-center gap-2 font-medium text-[#0F0F0E]">
                <Code className="h-4 w-4" />
                Endpoints
              </div>
              <div className="divide-y divide-[rgba(15,15,14,0.06)]">
                {[
                  { method: "POST", path: "/v1/chat/completions", desc: "Create a chat completion" },
                  { method: "GET", path: "/v1/models", desc: "List available models" },
                ].map((ep) => (
                  <div key={ep.path} className="flex items-center gap-4 py-3">
                    <span className="rounded-md bg-[rgba(15,15,14,0.06)] px-2 py-0.5 text-xs font-medium text-[#3A3A37]">
                      {ep.method}
                    </span>
                    <code className="text-sm text-[#0F0F0E]">{ep.path}</code>
                    <span className="text-sm text-[#7A7870]">{ep.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6">
              <h2 className="mb-3 text-lg font-medium text-[#0F0F0E]">OpenAPI Specification</h2>
              <p className="text-sm text-[#3A3A37]">
                Full OpenAPI 3.1 specification available for SDK generation and tooling integration.
              </p>
              <Link
                href="/api/v1/openapi.json"
                className="mt-4 inline-flex items-center gap-2 rounded-[10px] bg-[#0F0F0E] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3A3A37]"
              >
                View OpenAPI Spec
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
