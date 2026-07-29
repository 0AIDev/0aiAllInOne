import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { verifySession } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Marketplace - AI0FY",
  description: "Discover and install AI skills created by the community. Browse, buy, and use skills for your AI agents.",
};

export default async function MarketplacePage() {
  const session = await verifySession().catch(() => null);

  const skills = await prisma.skill.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { downloads: "desc" },
    take: 50,
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      category: true,
      priceCents: true,
      downloads: true,
      rating: true,
      creator: { select: { name: true } },
    },
  });

  return (
    <>
      <Navbar user={session ? { name: session.email, email: session.email } : null} />
      <div className="bg-[#F9F9F6]">
        <main className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <h1
            className="text-[clamp(32px,5vw,48px)] font-medium leading-[1.15] tracking-[-0.02em] text-[#0F0F0E]"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            <em className="italic" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
              Marketplace
            </em>
          </h1>
          <p className="mt-4 text-lg text-[#3A3A37]">
            Discover AI skills created by the community. Install and use them with your agents.
          </p>

          {skills.length === 0 ? (
            <div className="mt-16 rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-16 text-center">
              <p className="text-sm text-[#7A7870]">No skills published yet. Be the first creator!</p>
              {session && (
                <Link
                  href="/dashboard/creator/skills/new"
                  className="mt-4 inline-flex items-center gap-2 rounded-[10px] bg-[#0F0F0E] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3A3A37]"
                >
                  Create Your First Skill
                </Link>
              )}
            </div>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => (
                <Link
                  key={skill.id}
                  href={`/marketplace/${skill.slug}`}
                  className="group rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-base font-medium text-[#0F0F0E] group-hover:underline">
                        {skill.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-sm text-[#7A7870]">{skill.description}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[rgba(15,15,14,0.06)] px-2.5 py-0.5 text-xs font-medium text-[#3A3A37]">
                      {skill.priceCents === 0 ? "Free" : `$${(skill.priceCents / 100).toFixed(0)}`}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-xs text-[#7A7870]">
                    <span>{skill.creator.name ?? "Anonymous"}</span>
                    <span>·</span>
                    <span>{skill.downloads} downloads</span>
                    {skill.rating > 0 && (
                      <>
                        <span>·</span>
                        <span>{skill.rating.toFixed(1)}</span>
                      </>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
