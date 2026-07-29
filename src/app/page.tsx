import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { ProvidersShowcase } from "@/components/landing/providers-showcase";
import { HowItWorks } from "@/components/landing/how-it-works";
import { StatsSection } from "@/components/landing/stats-section";
import { CompatibleTools } from "@/components/landing/compatible-tools";
import { WhySection } from "@/components/landing/why-section";
import { ComparisonTable } from "@/components/landing/comparison-table";
import { CreatorSection } from "@/components/landing/creator-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CombosSection } from "@/components/landing/combos-section";
import { CtaSection } from "@/components/landing/cta-section";

export default function LandingPage() {
  return (
    <>
      <Navbar user={null} />
      <div className="bg-[#F9F9F6]">
        <main>
          <HeroSection />
          <ProvidersShowcase />
          <StatsSection />
          <FeaturesSection />
          <HowItWorks />
          <CompatibleTools />
          <WhySection />
          <ComparisonTable />
          <CreatorSection />
          <PricingSection />
          <CombosSection />
          <CtaSection />
        </main>
      </div>
      <Footer />
    </>
  );
}
