import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";


export const metadata: Metadata = {
  title: "System Status - AI0FY",
  description: "Current status of AI0FY services and components.",
};

const components = [
  { name: "API Endpoint", status: "operational" as const },
  { name: "Chat Completions", status: "operational" as const },
  { name: "Streaming Responses", status: "operational" as const },
  { name: "Provider Fallback Engine", status: "operational" as const },
  { name: "Prompt Compression", status: "operational" as const },
  { name: "Rate Limiting", status: "operational" as const },
  { name: "Subscription Management", status: "operational" as const },
  { name: "Dashboard & Analytics", status: "operational" as const },
  { name: "Webhook Delivery", status: "operational" as const },
  { name: "Multi-Tenant API", status: "operational" as const },
];

function StatusBadge({ status }: { status: "operational" | "degraded" | "down" }) {
  const styles = {
    operational: "bg-emerald-50 text-emerald-700 border-emerald-200",
    degraded: "bg-amber-50 text-amber-700 border-amber-200",
    down: "bg-red-50 text-red-700 border-red-200",
  };

  const labels = {
    operational: "Operational",
    degraded: "Degraded",
    down: "Down",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "operational"
            ? "bg-emerald-500"
            : status === "degraded"
              ? "bg-amber-500"
              : "bg-red-500"
        }`}
      />
      {labels[status]}
    </span>
  );
}

export default function StatusPage() {
  return (
    <>
      <Navbar user={null} />
      <div className="bg-[#F9F9F6]">
        <main>
          <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
            <h1
              className="text-[clamp(32px,5vw,48px)] font-medium leading-[1.1] tracking-[-0.02em] text-[#0F0F0E]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              System Status
            </h1>

            <div className="mt-8 rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                </span>
                <span className="text-lg font-medium text-[#0F0F0E]">All Systems Operational</span>
              </div>
              <p className="mt-1.5 text-sm text-[#7A7870]">
                All AI0FY services are running normally.
              </p>
            </div>

            <div className="mt-8 space-y-2">
              {components.map((component) => (
                <div
                  key={component.name}
                  className="flex items-center justify-between rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white px-6 py-4"
                >
                  <span className="font-medium text-[#0F0F0E]">{component.name}</span>
                  <StatusBadge status={component.status} />
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm text-[#7A7870] text-center">
              Status last updated: June 29, 2026 &middot; If you&apos;re experiencing issues,{" "}
              <a href="/contact" className="text-[#0F0F0E] underline underline-offset-2 decoration-[rgba(15,15,14,0.15)]">
                contact support
              </a>
            </p>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
