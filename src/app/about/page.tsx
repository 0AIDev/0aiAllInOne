import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AboutContent } from "./about-content";

export const metadata: Metadata = {
  title: "About - AI0FY",
  description: "Learn about AI0FY — the universal AI gateway powering 290+ providers.",
};

const team = [
  { initials: "MV", name: "Mattia Vizzi", role: "Founder & CEO" },
  { initials: "MT", name: "Mateo Torry", role: "Co-founder" },
  { initials: "LK", name: "Lucy Kon", role: "CTO" },
  { initials: "SB", name: "Steven Builds", role: "Head of Product" },
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
