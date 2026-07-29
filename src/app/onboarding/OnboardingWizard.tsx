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
  providers, totalConnected, totalProviders,
}: {
  providers: ProviderInfo[]; totalConnected: number; totalProviders: number;
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
              <svg width="28" height="28" viewBox="0 0 711 338" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M26.6 264.95C18.2 264.95 11.6667 261.333 7 254.1C2.33333 246.867 0 236.25 0 222.25C0 208.95 1.86667 195.65 5.6 182.35C9.33333 168.817 14.4667 155.983 21 143.85C27.5333 131.717 34.8833 120.983 43.05 111.65C51.45 102.317 60.2 94.9667 69.3 89.6C78.6333 84 87.85 81.2 96.95 81.2C101.383 81.2 105.583 82.1333 109.55 84C113.517 85.6333 116.783 88.3167 119.35 92.05C120.75 94.15 122.15 95.2 123.55 95.2C124.95 95.2 126.35 94.15 127.75 92.05C130.317 88.3167 132.417 85.9833 134.05 85.05C135.683 83.8833 137.2 83.3 138.6 83.3C141.633 83.3 142.8 84.9333 142.1 88.2L110.95 222.25C107.45 237.417 109.783 245 117.95 245C123.317 245 128.1 241.383 132.3 234.15C136.733 226.917 141.167 215.717 145.6 200.55C146.3 197.983 147.817 196.7 150.15 196.7C151.783 196.7 152.833 197.4 153.3 198.8C153.767 200.2 153.767 201.833 153.3 203.7C148.867 225.633 142.917 241.383 135.45 250.95C127.983 260.283 119 264.95 108.5 264.95C99.4 264.95 92.8667 261.1 88.9 253.4C85.1667 245.7 84.8167 235.2 87.85 221.9L92.4 202.65C92.8667 201.017 92.5167 200.083 91.35 199.85C90.4167 199.617 89.6 200.2 88.9 201.6C76.0667 225.167 64.6333 241.617 54.6 250.95C44.8 260.283 35.4667 264.95 26.6 264.95ZM35.35 247.1C40.95 247.1 47.1333 243.717 53.9 236.95C60.6667 230.183 67.3167 221.433 73.85 210.7C80.6167 199.967 86.8 188.417 92.4 176.05C98 163.683 102.433 151.783 105.7 140.35C109.2 128.917 110.95 119.233 110.95 111.3C110.95 97.0667 105.933 89.95 95.9 89.95C89.8333 89.95 83.4167 92.75 76.65 98.35C69.8833 103.717 63.35 111.067 57.05 120.4C50.9833 129.733 45.3833 140.35 40.25 152.25C35.35 163.917 31.3833 176.167 28.35 189C25.3167 201.6 23.8 213.967 23.8 226.1C23.8 234.267 24.7333 239.867 26.6 242.9C28.7 245.7 31.6167 247.1 35.35 247.1Z" fill="currentColor"/>
                <path d="M232.621 50.05C228.188 50.05 224.455 48.5333 221.421 45.5C218.621 42.2333 217.221 38.3833 217.221 33.95C217.221 27.65 219.088 22.6333 222.821 18.9C226.788 15.1667 231.221 13.3 236.121 13.3C240.788 13.3 244.638 14.8167 247.671 17.85C250.938 20.65 252.571 24.3833 252.571 29.05C252.571 35.5833 250.588 40.7167 246.621 44.45C242.655 48.1833 237.988 50.05 232.621 50.05ZM203.921 265.3C196.221 265.3 190.738 262.5 187.471 256.9C184.205 251.067 184.088 241.617 187.121 228.55L213.021 117.6C214.188 112.467 214.305 108.5 213.371 105.7C212.671 102.667 210.571 101.15 207.071 101.15C202.871 101.15 198.205 104.3 193.071 110.6C188.171 116.667 182.571 128.333 176.271 145.6C175.338 148.633 173.705 150.15 171.371 150.15C167.871 150.15 166.938 148.05 168.571 143.85C173.705 127.75 179.071 115.15 184.671 106.05C190.505 96.95 196.338 90.5333 202.171 86.8C208.005 83.0667 213.371 81.2 218.271 81.2C226.438 81.2 232.155 84.1167 235.421 89.95C238.688 95.55 238.805 104.883 235.771 117.95L209.871 228.9C208.705 234.033 208.471 238.117 209.171 241.15C210.105 243.95 212.321 245.35 215.821 245.35C220.021 245.35 224.571 242.317 229.471 236.25C234.605 229.95 240.321 218.167 246.621 200.9C247.555 197.867 249.188 196.35 251.521 196.35C255.021 196.35 255.955 198.45 254.321 202.65C249.421 218.517 243.938 231.117 237.871 240.45C232.038 249.55 226.205 255.967 220.371 259.7C214.538 263.433 209.055 265.3 203.921 265.3Z" fill="currentColor"/>
                <path d="M460.852 136.85L457.702 155.4C445.102 228.667 411.852 265.3 357.952 265.3C338.818 265.3 323.418 260.517 311.752 250.95C300.318 241.383 292.618 227.85 288.652 210.35C284.685 192.85 284.802 172.2 289.002 148.4L292.152 129.85C304.752 56.8167 337.885 20.3 391.552 20.3C410.685 20.3 426.085 25.0833 437.752 34.65C449.418 43.9833 457.235 57.4 461.202 74.9C465.168 92.4 465.052 113.05 460.852 136.85ZM419.202 116.55C424.102 86.2167 423.985 64.6333 418.852 51.8C413.952 38.9667 404.618 32.55 390.852 32.55C377.318 32.55 366.585 38.85 358.652 51.45C350.718 64.05 344.302 85.2833 339.402 115.15L330.652 168.7C325.752 198.567 325.752 220.15 330.652 233.45C335.552 246.517 344.768 253.05 358.302 253.05C372.068 253.05 382.918 246.633 390.852 233.8C399.018 220.967 405.552 199.733 410.452 170.1L419.202 116.55Z" fill="currentColor"/>
                <path d="M488.925 261.8C485.892 261.8 484.725 260.283 485.425 257.25L520.775 106.05C522.875 97.4167 520.075 93.1 512.375 93.1H505.025C501.292 93.1 499.425 91.4667 499.425 88.2C499.425 84.9333 501.525 83.3 505.725 83.3C512.959 83.3 518.325 82.3667 521.825 80.5C525.559 78.6333 528.009 74.9 529.175 69.3C532.209 56 536.642 44.2167 542.475 33.95C548.542 23.45 555.775 15.1667 564.175 9.09999C572.575 3.03333 581.792 0 591.825 0C599.992 0 606.525 1.98334 611.425 5.95001C616.559 9.68333 619.125 14.9333 619.125 21.7C619.125 26.8333 617.725 31.0333 614.925 34.3C612.359 37.3333 609.092 38.85 605.125 38.85C600.225 38.85 596.959 37.45 595.325 34.65C593.925 31.85 592.992 28.5833 592.525 24.85C592.292 21.1167 591.592 17.85 590.425 15.05C589.259 12.25 586.575 10.85 582.375 10.85C577.009 10.85 572.225 13.5333 568.025 18.9C564.059 24.0333 560.442 33.8333 557.175 48.3L550.175 78.75C549.475 81.7833 550.759 83.3 554.025 83.3H582.025C586.459 83.3 588.209 84.9333 587.275 88.2C586.575 91.4667 584.475 93.1 580.975 93.1H550.525C548.192 93.1 546.675 94.2667 545.975 96.6L508.525 257.95C507.825 260.517 506.192 261.8 503.625 261.8H488.925Z" fill="currentColor"/>
                <path d="M557.826 337.05C548.96 337.05 542.076 334.717 537.176 330.05C532.276 325.617 529.826 320.133 529.826 313.6C529.826 308.7 531.109 304.967 533.676 302.4C536.243 300.067 539.043 298.9 542.076 298.9C546.51 298.9 549.66 300.067 551.526 302.4C553.393 304.733 554.793 307.417 555.726 310.45C556.66 313.717 558.176 316.517 560.276 318.85C562.143 321.183 565.293 322.35 569.726 322.35C578.36 322.35 586.876 318.85 595.276 311.85C603.676 305.083 610.559 295.633 615.926 283.5C621.293 271.6 623.626 258.183 622.926 243.25L617.676 117.6C617.443 111.533 616.393 107.333 614.526 105C612.66 102.433 610.326 101.15 607.526 101.15C602.393 101.15 597.493 104.3 592.826 110.6C588.16 116.667 584.31 128.333 581.276 145.6C580.576 148.633 579.06 150.15 576.726 150.15C573.46 150.15 572.176 148.05 572.876 143.85C575.676 127.75 579.526 115.15 584.426 106.05C589.559 96.95 594.926 90.5333 600.526 86.8C606.36 83.0667 611.726 81.2 616.626 81.2C623.859 81.2 629.576 83.7667 633.776 88.9C637.976 93.8 640.31 102.317 640.776 114.45L645.676 248.85C645.676 250.483 646.143 251.533 647.076 252C648.243 252.233 649.293 251.65 650.226 250.25C658.393 238.817 665.743 227.033 672.276 214.9C679.043 202.533 684.409 190.4 688.376 178.5C692.343 166.6 694.326 155.633 694.326 145.6C694.326 135.8 693.276 128.1 691.176 122.5C689.076 116.667 686.86 111.767 684.526 107.8C682.426 103.833 681.376 99.5167 681.376 94.85C681.376 85.75 685.343 81.2 693.276 81.2C704.476 81.2 710.076 93.5667 710.076 118.3C710.076 131.833 707.743 146.65 703.076 162.75C698.41 178.617 691.993 194.833 683.826 211.4C675.893 227.733 666.676 243.367 656.176 258.3C645.909 273.233 635.059 286.65 623.626 298.55C612.426 310.45 601.109 319.783 589.676 326.55C578.476 333.55 567.86 337.05 557.826 337.05Z" fill="currentColor"/>
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-[#0F0F0E]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
              {t("onboarding.welcomeTitle")}
            </h1>
            <p className="mt-2 text-sm text-[#7A7870]">{t("onboarding.welcomeDesc")}</p>
          </div>
        )}

        {step === 1 && (
          <div className="text-center">
            <h2 className="text-lg font-semibold text-[#0F0F0E]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
              {t("onboarding.oauthTitle")}
            </h2>
            <p className="mt-1 text-sm text-[#7A7870]">{t("onboarding.oauthDesc")}</p>
            <div className="mt-8 flex flex-col items-center gap-4">
              <button
                onClick={() => {
                  const { origin } = window.location;
                  window.open(`${origin}/api/auth/github`, "_blank");
                }}
                className="inline-flex items-center gap-3 rounded-[14px] border border-[rgba(15,15,14,0.12)] bg-white px-8 py-4 text-sm font-medium text-[#0F0F0E] transition-all hover:bg-[rgba(15,15,14,0.03)] hover:shadow-md"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                {t("register.github")}
                <ArrowRight className="h-5 w-5" />
              </button>
              <p className="text-xs text-[#7A7870]">Connect GitHub to auto-import your repos and sync tokens across all AI coding tools.</p>
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
            onClick={async () => {
              await fetch("/api/auth/onboarding-complete", { method: "POST" });
              router.push("/dashboard");
            }}
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
