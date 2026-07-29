import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - AI0FY",
  description: "AI0FY Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F6]">
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#7A7870] transition-colors hover:text-[#0F0F0E]"
        >
          &larr; Back to Home
        </Link>
        <h1
          className="mt-8 text-[clamp(32px,5vw,48px)] font-medium leading-[1.1] tracking-[-0.02em] text-[#0F0F0E]"
          style={{ fontFamily: "'Inter Tight', sans-serif" }}
        >
          Terms of{" "}
          <em
            className="italic"
            style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
          >
            Service
          </em>
        </h1>
        <p className="mt-4 text-sm text-[#7A7870]">
          Last updated: July 29, 2026
        </p>

        <div className="mt-12 space-y-10 text-[15px] leading-relaxed text-[#3A3A37]">
          <section>
            <h2 className="mb-3 text-lg font-medium text-[#0F0F0E]">1. Acceptance of Terms</h2>
            <p>
              By accessing or using AI0FY (&quot;the Service&quot;), you agree to be bound by these
              Terms of Service. If you do not agree to these terms, you may not use the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[#0F0F0E]">2. Description of Service</h2>
            <p>
              AI0FY provides a unified API gateway for AI model inference, including automatic
              provider fallback, quota management, prompt compression, and subscription billing.
              The Service acts as a proxy between your application and third-party AI providers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[#0F0F0E]">3. Account Registration</h2>
            <p>
              You must provide accurate and complete information when creating an account. You are
              responsible for maintaining the confidentiality of your API keys and account credentials.
              You are liable for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[#0F0F0E]">4. API Usage & Rate Limits</h2>
            <p>
              Your use of the API is subject to rate limits based on your subscription tier.
              We reserve the right to throttle, suspend, or terminate access for accounts that
              exceed rate limits or engage in abusive behavior. You may not use the Service
              for any illegal or unauthorized purpose.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[#0F0F0E]">5. Billing & Payment</h2>
            <p>
              Paid plans are billed monthly or annually via Stripe. You authorize us to charge
              your payment method for the selected plan. Subscription fees are non-refundable
              except where required by law. You may cancel your subscription at any time -
              access continues until the end of the billing period.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[#0F0F0E]">6. Service Level Agreement</h2>
            <p>
              Pro and Enterprise plans include a 99.9% uptime SLA. If we fail to meet this
              commitment in a given month, you may be eligible for service credits. SLA terms
              are detailed in your plan agreement.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[#0F0F0E]">7. Intellectual Property</h2>
            <p>
              The Service, including its code, design, and documentation, is protected by
              copyright and other intellectual property laws. You retain ownership of your
              API request and response data. We claim no ownership over your content.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[#0F0F0E]">8. Third-Party Providers</h2>
            <p>
              The Service integrates with third-party AI providers. We are not responsible for
              the availability, accuracy, or content of responses from these providers. Your use
              of third-party providers through our Service is subject to their respective terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[#0F0F0E]">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, AI0FY shall not be liable for any indirect,
              incidental, special, or consequential damages arising from your use of the Service.
              Our total liability is limited to the amount you paid us in the 12 months preceding
              the claim.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[#0F0F0E]">10. Termination</h2>
            <p>
              We may suspend or terminate your account for violation of these terms. You may
              terminate your account at any time. Upon termination, your data will be deleted
              within 30 days, except as required for legal or billing purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[#0F0F0E]">11. Changes to Terms</h2>
            <p>
              We may modify these terms at any time. We will notify you of material changes via
              email or through the platform. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[#0F0F0E]">12. Contact</h2>
            <p>
              For questions about these terms, contact us at{" "}
              <a href="mailto:legal@ai0fy.dev" className="underline underline-offset-4 transition-colors hover:text-[#0F0F0E]">
legal@ai0fy.dev
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
