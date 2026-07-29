import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - AI0FY",
  description: "AI0FY Privacy Policy",
};

export default function PrivacyPage() {
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
          Privacy{" "}
          <em
            className="italic"
            style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
          >
            Policy
          </em>
        </h1>
        <p className="mt-4 text-sm text-[#7A7870]">
          Last updated: July 29, 2026
        </p>

        <div className="mt-12 space-y-10 text-[15px] leading-relaxed text-[#3A3A37]">
          <section>
            <h2 className="mb-3 text-lg font-medium text-[#0F0F0E]">1. Information We Collect</h2>
            <p>
              When you create an account, we collect your name, email address, and organization name.
              When you use our API, we collect request metadata including timestamps, model IDs,
              token counts, and latency metrics. We do not store the content of your API requests
              or responses beyond what is necessary for debugging and billing.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[#0F0F0E]">2. How We Use Your Information</h2>
            <p>
              We use your information to provide and improve our services, process billing,
              send service-related communications, and ensure the security of our platform.
              We do not sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[#0F0F0E]">3. Data Storage & Security</h2>
            <p>
              Provider API keys are encrypted at rest using AES-256-GCM encryption. Your data is
              stored in secure data centers with access controls. We implement industry-standard
              security measures including encryption in transit (TLS 1.3), regular security audits,
              and strict access policies.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[#0F0F0E]">4. API Usage Data</h2>
            <p>
              We collect anonymous usage metrics including token counts, latency, error rates,
              and provider health status. This data is used to improve routing algorithms,
              optimize performance, and provide accurate billing. Individual request content
              is not stored or used for model training.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[#0F0F0E]">5. Cookies</h2>
            <p>
              We use essential cookies for authentication and session management. We do not use
              tracking cookies or third-party analytics cookies. You can disable cookies in your
              browser settings, but this may affect the functionality of our service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[#0F0F0E]">6. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal data. You can export
              your data or request account deletion at any time by contacting our support team.
              We will respond to data requests within 30 days.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[#0F0F0E]">7. Third-Party Services</h2>
            <p>
              Our service integrates with third-party AI providers (OpenAI, Anthropic, Google, etc.).
              When you make API requests through our gateway, your requests are forwarded to these
              providers. Please refer to each provider&apos;s privacy policy for their data handling
              practices. We use Stripe for payment processing - their privacy policy applies to
              payment data.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[#0F0F0E]">8. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any
              material changes via email or through our platform. Continued use of the service
              after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-[#0F0F0E]">9. Contact Us</h2>
            <p>
              If you have questions about this privacy policy or our data practices, please
              contact us at{" "}
              <a href="mailto:privacy@ai0fy.dev" className="underline underline-offset-4 transition-colors hover:text-[#0F0F0E]">
privacy@ai0fy.dev
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
