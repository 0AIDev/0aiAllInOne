import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArrowRight, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog - AI0FY",
  description: "Latest news, tutorials, and updates from the AI0FY team.",
};

const posts = [
  {
    title: "Introducing AI0FY: The Universal AI Gateway",
    date: "June 15, 2026",
    excerpt:
      "We're excited to announce AI0FY — a unified API endpoint that gives you access to 290+ AI providers with automatic fallback, prompt compression, and built-in guardrails.",
    slug: "introducing-ai0fy",
  },
  {
    title: "Multi-Provider Fallback: Never Downtime Your AI",
    date: "June 8, 2026",
    excerpt:
      "Learn how AI0FY's intelligent multi-provider fallback ensures your application stays online even when individual providers experience outages or rate limits.",
    slug: "multi-provider-fallback",
  },
  {
    title: "Prompt Compression Without Quality Loss",
    date: "May 28, 2026",
    excerpt:
      "Reduce your token usage by up to 60% with AI0FY's state-of-the-art prompt compression. Compatible with all major LLM providers.",
    slug: "prompt-compression",
  },
];

export default function BlogPage() {
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
                Blog
              </em>
            </h1>
            <p className="mt-4 text-lg text-[#3A3A37]">
              Thoughts, tutorials, and updates from the AI0FY team.
            </p>

            <div className="mt-12 space-y-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6 transition-all hover:border-[rgba(15,15,14,0.16)] hover:shadow-md"
                >
                  <div className="flex items-center gap-2 text-sm text-[#7A7870]">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <h2 className="mt-3 text-xl font-medium text-[#0F0F0E]">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-[#3A3A37] leading-relaxed">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#0F0F0E]">
                    Read more <ArrowRight className="h-3.5 w-3.5" />
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
