import type { Metadata } from "next";
import { FeaturesSection } from "@/components/landing/features-section";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Features - AI0FY",
  description: "Everything you need to ship AI features. Auto-fallback, prompt compression, guardrails, multi-tenant, and more.",
};

export default function FeaturesPage() {
  return (
    <>
      <Navbar user={null} />
      <div className="bg-[#F9F9F6]">
        <main>
          <FeaturesSection />
        </main>
      </div>
      <Footer />
    </>
  );
}
