"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

interface Plan {
  id: string;
  tier: string;
  name: string;
  description: string | null;
  monthlyPrice: number;
  tokensPerMonth: number;
  requestsPerMin: number;
  maxApiKeys: number;
  features: string;
}

interface PlanCardsProps {
  plans: Plan[];
  currentTier: string;
}

const tierOrder = ["FREE", "STARTER", "PRO", "BUSINESS", "ENTERPRISE"];

export function PlanCards({ plans, currentTier }: PlanCardsProps) {
  const router = useRouter();

  const sorted = [...plans].sort(
    (a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier)
  );

  async function handleChange(planTier: string) {
    const res = await fetch("/api/subscription/change-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planTier }),
    });
    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {sorted.map((plan) => {
        const isCurrent = plan.tier === currentTier;
        const features: string[] = JSON.parse(plan.features || "[]");
        const currentIndex = tierOrder.indexOf(currentTier);
        const planIndex = tierOrder.indexOf(plan.tier);
        const isUpgrade = planIndex > currentIndex;

        return (
          <div
            key={plan.id}
            className={
              "flex flex-col rounded-[14px] border bg-white p-6 " +
              (isCurrent
                ? "border-[#0F0F0E] ring-2 ring-[#0F0F0E]"
                : "border-[rgba(15,15,14,0.08)]")
            }
          >
            <h3
              className="text-lg font-medium tracking-[-0.01em] text-[#0F0F0E]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              {plan.name}
            </h3>

            <div className="mb-6 mt-4">
              <span
                className="text-[44px] font-medium leading-none tracking-[-0.02em] text-[#0F0F0E]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                {plan.monthlyPrice === 0
                  ? "Free"
                  : `$${plan.monthlyPrice.toLocaleString()}`}
              </span>
              {plan.monthlyPrice > 0 && (
                <span className="text-sm text-[#7A7870]"> /mo</span>
              )}
            </div>

            <div className="mb-4 space-y-2 text-sm text-[#3A3A37]">
              <p>{plan.tokensPerMonth.toLocaleString()} tokens / month</p>
              <p>{plan.requestsPerMin} RPM</p>
              <p>{plan.maxApiKeys} API keys</p>
            </div>

            {features.length > 0 && (
              <ul className="mb-6 flex-1 space-y-2.5">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#10b981]" />
                    <span className="text-[#3A3A37]">{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {!isCurrent && (
              <button
                onClick={() => handleChange(plan.tier)}
                className={
                  "inline-flex w-full items-center justify-center rounded-[10px] px-6 py-3 text-sm font-medium transition-colors " +
                  (isUpgrade
                    ? "bg-[#0F0F0E] text-white hover:bg-[#2a2a28]"
                    : "border border-[rgba(15,15,14,0.12)] bg-white text-[#0F0F0E] hover:bg-[rgba(15,15,14,0.03)]")
                }
              >
                {isUpgrade ? "Upgrade" : "Downgrade"}
              </button>
            )}

            {isCurrent && (
              <div className="w-full rounded-[10px] border border-[rgba(15,15,14,0.08)] bg-[#F9F9F6] px-6 py-3 text-center text-sm font-medium text-[#7A7870]">
                Current plan
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
