import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "SDKs & Libraries - AI0FY",
  description: "Official AI0FY SDKs for popular programming languages.",
};

const sdks = [
  {
    name: "TypeScript / JavaScript",
    lang: "ts",
    description:
      "The official TypeScript SDK for AI0FY. Fully typed, supports all endpoints, streaming, and provider fallback. Drop-in compatible with the OpenAI SDK.",
    color: "bg-blue-50 text-blue-700",
  },
  {
    name: "Python",
    lang: "py",
    description:
      "The official Python SDK for AI0FY. Async and sync clients, complete type annotations, and seamless integration with popular frameworks like FastAPI and Django.",
    color: "bg-sky-50 text-sky-700",
  },
  {
    name: "Go",
    lang: "go",
    description:
      "The official Go SDK for AI0FY. High-performance, concurrent-safe client with built-in retry logic and connection pooling.",
    color: "bg-cyan-50 text-cyan-700",
  },
  {
    name: "Rust",
    lang: "rs",
    description:
      "The official Rust SDK for AI0FY. Zero-cost abstractions, async support via tokio, and minimal memory footprint.",
    color: "bg-orange-50 text-orange-700",
  },
  {
    name: "Java / Kotlin",
    lang: "java",
    description:
      "The official Java SDK for AI0FY. Compatible with Java 17+, Kotlin coroutines support, and Spring Boot integration.",
    color: "bg-red-50 text-red-700",
  },
];

export default function SDKsPage() {
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
                SDKs
              </em>{" "}
              &amp; Libraries
            </h1>
            <p className="mt-4 text-lg text-[#3A3A37]">
              Official client libraries for integrating AI0FY into your application.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {sdks.map((sdk) => (
                <div
                  key={sdk.lang}
                  className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(15,15,14,0.04)] text-lg font-semibold text-[#0F0F0E]">
                      {sdk.lang === "ts" ? "TS" : sdk.lang === "py" ? "Py" : sdk.lang === "go" ? "Go" : sdk.lang === "rs" ? "Rs" : "Jv"}
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${sdk.color}`}>
                      Coming soon
                    </span>
                  </div>
                  <h2 className="mt-4 text-lg font-medium text-[#0F0F0E]">{sdk.name}</h2>
                  <p className="mt-2 text-sm text-[#3A3A37] leading-relaxed">{sdk.description}</p>
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
