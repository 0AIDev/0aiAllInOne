"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, Plus, Minus } from "lucide-react";

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

const PRESET_CREDITS = [10, 25, 50, 100, 250];

export function PlanCards({ plans, currentTier }: PlanCardsProps) {
  const router = useRouter();
  const [credits, setCredits] = useState(50);
  const [buying, setBuying] = useState(false);

  const sorted = [...plans].sort(
    (a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier)
  );

  async function handleChange(planTier: string) {
    const res = await fetch("/api/subscription/change-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planTier }),
    });
    if (res.ok) router.refresh();
  }

  return (
    <div className="mt-8 space-y-12">
      {/* Plan cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {sorted.map((plan) => {
          const isCurrent = plan.tier === currentTier;
          const features: string[] = JSON.parse(plan.features || "[]");
          const currentIndex = tierOrder.indexOf(currentTier);
          const planIndex = tierOrder.indexOf(plan.tier);
          const isUpgrade = planIndex > currentIndex;
          const isPro = plan.tier === "PRO";

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-[14px] border p-6 sm:p-8 transition-all ${
                isCurrent
                  ? "border-transparent bg-[#0F0F0E] text-white pt-10"
                  : "border-[rgba(15,15,14,0.08)] bg-white"
              }`}
            >
              {isPro && !isCurrent && (
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10 rounded-full bg-white px-4 py-1 text-[11px] font-medium text-[#0F0F0E] shadow-[0_2px_8px_rgba(15,15,14,0.1)]">
                  Most popular
                </div>
              )}

              <h3 className={`text-lg font-medium tracking-[-0.01em] ${isCurrent ? "text-white" : "text-[#0F0F0E]"}`}>
                {plan.name}
              </h3>

              <div className="mb-6 mt-4">
                <span className={`text-[44px] font-medium leading-none tracking-[-0.02em] ${isCurrent ? "text-white" : "text-[#0F0F0E]"}`}>
                  {plan.monthlyPrice === 0 ? "$0" : `$${plan.monthlyPrice.toLocaleString()}`}
                </span>
                {plan.monthlyPrice > 0 && (
                  <span className={`text-sm ${isCurrent ? "text-white/50" : "text-[#7A7870]"}`}> /mo</span>
                )}
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                <li className="flex items-start gap-3 text-sm">
                  <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${isCurrent ? "text-white/60" : "text-[#10b981]"}`} />
                  <span className={isCurrent ? "text-white/70" : "text-[#3A3A37]"}>
                    {plan.tokensPerMonth.toLocaleString()} tokens / month
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${isCurrent ? "text-white/60" : "text-[#10b981]"}`} />
                  <span className={isCurrent ? "text-white/70" : "text-[#3A3A37]"}>
                    {plan.requestsPerMin} RPM limit
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${isCurrent ? "text-white/60" : "text-[#10b981]"}`} />
                  <span className={isCurrent ? "text-white/70" : "text-[#3A3A37]"}>
                    {plan.maxApiKeys} API keys
                  </span>
                </li>
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${isCurrent ? "text-white/60" : "text-[#10b981]"}`} />
                    <span className={isCurrent ? "text-white/70" : "text-[#3A3A37]"}>{feature}</span>
                  </li>
                ))}
              </ul>

              {!isCurrent ? (
                <button
                  onClick={() => handleChange(plan.tier)}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-[10px] px-6 py-3 text-sm font-medium transition-colors ${
                    isUpgrade
                      ? "bg-[#0F0F0E] text-white hover:bg-[#3A3A37]"
                      : "border border-[rgba(15,15,14,0.12)] bg-white text-[#0F0F0E] hover:bg-[rgba(15,15,14,0.03)]"
                  }`}
                >
                  {isUpgrade ? "Upgrade" : "Downgrade"}
                  {isUpgrade && <ArrowRight className="h-4 w-4" />}
                </button>
              ) : (
                <div className="w-full rounded-[10px] border border-[rgba(15,15,14,0.08)] bg-[#F9F9F6] px-6 py-3 text-center text-sm font-medium text-[#7A7870]">
                  Current plan
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Buy Credits */}
      <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-8">
        <h2 className="text-xl font-medium text-[#0F0F0E]">Buy Credits</h2>
        <p className="mt-1 text-sm text-[#7A7870]">
          One credit = one API request. Credits never expire. Use them across any provider.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {PRESET_CREDITS.map((amount) => (
            <button
              key={amount}
              onClick={() => setCredits(amount)}
              className={`rounded-[10px] border px-5 py-2.5 text-sm font-medium transition-all ${
                credits === amount
                  ? "border-[#0F0F0E] bg-[#0F0F0E] text-white"
                  : "border-[rgba(15,15,14,0.12)] text-[#3A3A37] hover:border-[#0F0F0E]"
              }`}
            >
              {amount.toLocaleString()} credits
              <span className="ml-1.5 text-xs opacity-70">— ${amount}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCredits(Math.max(1, credits - 10))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(15,15,14,0.12)] transition-colors hover:bg-[rgba(15,15,14,0.03)]"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              value={credits}
              onChange={(e) => setCredits(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              className="w-24 rounded-[10px] border border-[rgba(15,15,14,0.12)] bg-[#F1EFE9] px-4 py-2 text-center text-sm text-[#0F0F0E] outline-none focus:border-[#0F0F0E]"
            />
            <button
              onClick={() => setCredits(credits + 10)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(15,15,14,0.12)] transition-colors hover:bg-[rgba(15,15,14,0.03)]"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => setBuying(true)}
            disabled={buying}
            className="inline-flex items-center gap-2 rounded-[10px] bg-[#0F0F0E] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3A3A37] disabled:opacity-50"
          >
            {buying ? "Processing..." : `Buy ${credits.toLocaleString()} credits — $${credits}`}
          </button>
        </div>
      </div>
    </div>
  );
}
