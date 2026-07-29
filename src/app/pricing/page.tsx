import type { Metadata } from "next";
import { PricingSection } from "@/components/landing/pricing-section";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Pricing - AI0FY",
  description: "Start free, scale as you grow. Simple pricing for every team size.",
};

export default function PricingPage() {
  return (
    <>
      <Navbar user={null} />
      <div className="bg-[#F9F9F6]">
        <main>
          <PricingSection />
        </main>
      </div>
      <Footer />
    </>
  );
}
