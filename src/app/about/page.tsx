import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AboutContent } from "./about-content";

export const metadata: Metadata = {
  title: "About - AIStack",
  description: "Learn about AIStack — the universal AI gateway powering 290+ providers.",
};

const team = [
  { initials: "AL", name: "Alex Liu", role: "Founder & CEO" },
  { initials: "SM", name: "Sarah Mehta", role: "CTO" },
  { initials: "JP", name: "James Park", role: "Head of Engineering" },
  { initials: "KR", name: "Kim Rossi", role: "Head of Product" },
  { initials: "DT", name: "David Tran", role: "Lead ML Engineer" },
  { initials: "LW", name: "Lisa Wang", role: "Head of Design" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar user={null} />
      <div className="bg-[#F9F9F6]">
        <main>
          <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
            <AboutContent team={team} />
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
