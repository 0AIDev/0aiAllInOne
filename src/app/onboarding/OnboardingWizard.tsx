"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  Check, Key, Shield, ArrowRight, Zap,
} from "lucide-react";
import { useLocale } from "@/i18n/locale-provider";

interface ProviderInfo {
  slug: string;
  name: string;
  connected: boolean;
  needsAuth: boolean;
}

const faviconUrl = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

const providerDomains: Record<string, string> = {
  openai: "openai.com",
  anthropic: "anthropic.com",
  "google-gemini": "gemini.google.com",
  groq: "groq.com", deepseek: "deepseek.com",
  mistral: "mistral.ai", cohere: "cohere.com",
  cerebras: "cerebras.ai", "nvidia-nim": "nvidia.com",
  sambanova: "sambanova.ai", together: "together.ai",
  fireworks: "fireworks.ai", perplexity: "perplexity.ai",
  "xai-grok": "x.ai", "meta-llama": "meta.ai",
};

function getDomain(slug: string): string {
  return providerDomains[slug] ?? `${slug.replace(/-/g, "")}.com`;
}

export function OnboardingWizard({
  providers, totalConnected, totalProviders, hasApiKey: _hasApiKey,
}: {
  providers: ProviderInfo[]; totalConnected: number; totalProviders: number; hasApiKey: boolean;
}) {
  const { t } = useLocale();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const stepData = [
    { id: "welcome", icon: Zap, title: t("onboarding.step1Title"), description: t("onboarding.step1Desc") },
    { id: "oauth", icon: Shield, title: t("onboarding.step2Title"), description: t("onboarding.step2Desc") },
    { id: "apikey", icon: Key, title: t("onboarding.step3Title"), description: t("onboarding.step3Desc") },
    { id: "done", icon: Check, title: t("onboarding.step4Title"), description: t("onboarding.step4Desc") },
  ];

  const prev = step > 0;
  const next = step < stepData.length - 1;
  const isLast = step === stepData.length - 1;

  function goNext() { if (next) setStep(step + 1); }
  function goPrev() { if (prev) setStep(step - 1); }

  const oauthProviders = [
    { slug: "claude", name: "Claude Code" },
    { slug: "codex", name: "OpenAI Codex" },
    { slug: "github-copilot", name: "GitHub Copilot" },
    { slug: "cursor", name: "Cursor IDE" },
    { slug: "gitlab-duo", name: "GitLab Duo" },
    { slug: "grok-build", name: "Grok Build" },
  ];

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12">
      {/* Progress */}
      <div className="mb-12">
        <div className="flex items-center gap-2">
          {stepData.map((st, i) => (
            <div key={st.id} className="flex flex-1 items-center gap-2">
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all",
                i < step ? "bg-[#0F0F0E] text-white" : i === step ? "bg-[#0F0F0E] text-white" : "bg-[rgba(15,15,14,0.06)] text-[#7A7870]"
              )}>
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              {i < stepData.length - 1 && <div className={cn("h-px flex-1", i < step ? "bg-[#0F0F0E]" : "bg-[rgba(15,15,14,0.08)]")} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-8">
        {step === 0 && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0F0F0E]">
              <span className="text-xl font-bold italic text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>A</span>
            </div>
            <h1 className="text-2xl font-semibold text-[#0F0F0E]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
              {t("onboarding.welcomeTitle")}
            </h1>
            <p className="mt-2 text-sm text-[#7A7870]">{t("onboarding.welcomeDesc")}</p>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-[#0F0F0E]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
              {t("onboarding.oauthTitle")}
            </h2>
            <p className="mt-1 text-sm text-[#7A7870]">{t("onboarding.oauthDesc")}</p>
            <div className="mt-6 space-y-2">
              {oauthProviders.map((p) => (
                <div key={p.slug} className="flex items-center gap-3 rounded-lg border border-[rgba(15,15,14,0.08)] px-4 py-3">
                  <Image src={faviconUrl(getDomain(p.slug))} alt={p.name} width={18} height={18} className="h-[18px] w-[18px] shrink-0 rounded object-contain" unoptimized />
                  <span className="flex-1 text-sm font-medium text-[#0F0F0E]">{p.name}</span>
                  <span className="rounded-full bg-[rgba(15,15,14,0.04)] px-2.5 py-0.5 text-[11px] font-medium text-[#9CA3AF]">{t("onboarding.oauthNoConnection")}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold text-[#0F0F0E]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
              {t("onboarding.apiKeyTitle")}
            </h2>
            <p className="mt-1 text-sm text-[#7A7870]">{t("onboarding.apiKeyDesc")}</p>
            <div className="mt-6 max-h-[320px] space-y-2 overflow-y-auto">
              {providers.filter((p) => p.needsAuth).slice(0, 12).map((p) => (
                <div key={p.slug} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
                  <Image src={faviconUrl(getDomain(p.slug))} alt={p.name} width={16} height={16} className="h-4 w-4 shrink-0 rounded object-contain" unoptimized />
                  <span className="flex-1 text-sm font-medium text-[#0F0F0E]">{p.name}</span>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", p.connected ? "bg-emerald-50 text-emerald-600" : "bg-[rgba(15,15,14,0.04)] text-[#9CA3AF]")}>
                    {p.connected ? t("onboarding.connected") : t("onboarding.noConnection")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <Check className="h-7 w-7 text-emerald-500" />
            </div>
            <h2 className="text-xl font-semibold text-[#0F0F0E]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
              {t("onboarding.doneTitle")}
            </h2>
            <p className="mt-2 text-sm text-[#7A7870]">
              {totalConnected}/{totalProviders} providers connected.
            </p>
            <p className="mt-1 text-sm text-[#7A7870]">
              {t("onboarding.doneDesc")}
            </p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={goPrev}
          className={cn("rounded-[10px] px-4 py-2.5 text-sm font-medium text-[#7A7870] transition-colors hover:text-[#0F0F0E]", !prev && "invisible")}
        >
          {t("onboarding.back")}
        </button>
        {isLast ? (
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 rounded-[10px] bg-[#0F0F0E] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3A3A37]"
          >
            {t("onboarding.goToDashboard")}
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={goNext}
            className="inline-flex items-center gap-2 rounded-[10px] bg-[#0F0F0E] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3A3A37]"
          >
            {t("onboarding.continue")}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
