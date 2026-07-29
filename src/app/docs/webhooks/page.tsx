import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Webhook } from "lucide-react";

export const metadata: Metadata = {
  title: "Webhooks - AI0FY",
  description: "AI0FY webhook events and integration guide.",
};

const events = [
  {
    event: "request.start",
    description: "Triggered when an API request begins processing.",
  },
  {
    event: "request.completed",
    description: "Triggered when an API request completes successfully.",
  },
  {
    event: "request.failed",
    description: "Triggered when an API request fails after all retries and fallbacks are exhausted.",
  },
  {
    event: "rate.limited",
    description: "Triggered when a request is rate-limited by a provider and AI0FY switches to a fallback.",
  },
  {
    event: "quota.exceeded",
    description: "Triggered when a user or tenant exceeds their allocated quota.",
  },
];

const payloadExample = `{
  "event": "request.completed",
  "timestamp": "2026-06-29T12:00:00Z",
  "data": {
    "request_id": "req_abc123",
    "tenant_id": "tenant_xyz",
    "user_id": "user_456",
    "provider": "openai",
    "model": "gpt-4o",
    "tokens_in": 145,
    "tokens_out": 32,
    "duration_ms": 1247,
    "status": "success"
  }
}`;

export default function WebhooksPage() {
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
                Webhooks
              </em>
            </h1>
            <p className="mt-4 text-lg text-[#3A3A37]">
              Receive real-time notifications about events happening in your AI0FY account.
              Configure webhook endpoints in your dashboard to get HTTP callbacks for important events.
            </p>

            <div className="mt-12">
              <h2 className="text-xl font-medium text-[#0F0F0E]">Event Types</h2>
              <p className="mt-2 text-sm text-[#3A3A37]">
                AI0FY fires webhook events for the following actions:
              </p>

              <div className="mt-6 overflow-hidden rounded-[14px] border border-[rgba(15,15,14,0.08)]">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[rgba(15,15,14,0.03)]">
                      <th className="px-6 py-3 text-sm font-medium text-[#0F0F0E]">Event</th>
                      <th className="px-6 py-3 text-sm font-medium text-[#0F0F0E]">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(15,15,14,0.06)]">
                    {events.map((evt) => (
                      <tr key={evt.event} className="bg-white">
                        <td className="px-6 py-4">
                          <code className="rounded-md bg-[rgba(15,15,14,0.04)] px-2 py-1 text-sm font-mono text-[#0F0F0E]">
                            {evt.event}
                          </code>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#3A3A37]">{evt.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-xl font-medium text-[#0F0F0E]">Example Payload</h2>
              <p className="mt-2 text-sm text-[#3A3A37]">
                All webhook payloads follow this structure:
              </p>
              <div className="mt-4 overflow-x-auto rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-[#0F0F0E] p-6">
                <pre className="text-sm leading-relaxed text-[#B8B5AE] font-mono whitespace-pre">
                  {payloadExample}
                </pre>
              </div>
            </div>

            <div className="mt-12 rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(15,15,14,0.04)]">
                  <Webhook className="h-5 w-5 text-[#0F0F0E]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#0F0F0E]">Configuring Webhooks</h3>
                  <p className="mt-1 text-sm text-[#3A3A37]">
                    You can configure webhook endpoints from the Dashboard &rarr; Webhooks section.
                    Each endpoint can be filtered by event type. AI0FY supports retries with
                    exponential backoff for failed deliveries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
