"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useLocale } from "@/i18n/locale-provider";

export function HeroSection() {
  const { t } = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { ref: badgeRef, isVisible: badgeVisible } = useScrollReveal();
  const { ref: headingRef, isVisible: headingVisible } = useScrollReveal();
  const { ref: subRef, isVisible: subVisible } = useScrollReveal();
  const { ref: formRef, isVisible: formVisible } = useScrollReveal();
  const { ref: metaRef, isVisible: metaVisible } = useScrollReveal();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (email.trim()) params.set("email", email.trim());
    router.push(`/register?${params.toString()}`);
  }

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div style={{ width: 'clamp(250px, 50vw, 450px)', height: 'auto' }}>
          <img src="/hero-bg-logo.svg" alt="" style={{ display: 'block', width: '100%', height: 'auto' }} />
        </div>
      </div>
      {/* Eyebrow badge */}
      <div
        ref={badgeRef}
        className={cn(
          "mb-10 inline-flex items-center gap-2.5 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-[#3A3A37] transition-all duration-700",
          badgeVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        )}
      >
        <span className="font-semibold text-[#0F0F0E]">Unified API Gateway</span><span className="text-[#7A7870]"> — {t("hero.badge")}</span>
      </div>

      {/* Main heading */}
      <h1
          ref={headingRef}
          className={cn(
            "max-w-4xl text-center text-[clamp(48px,8vw,104px)] font-medium leading-[1.05] tracking-[-0.02em] text-[#0F0F0E] transition-all duration-700 delay-100",
            headingVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
          style={{ fontFamily: "'Inter Tight', sans-serif" }}
        >
          {t("hero.title")}
          <br />
          <em
            className="italic"
            style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
          >
            {t("hero.titleEmphasis")}
          </em>
          .
        </h1>

      {/* Subtitle */}
      <p
        ref={subRef}
        className={cn(
          "mt-6 max-w-2xl text-center text-[18px] leading-relaxed text-[#3A3A37] transition-all duration-700 delay-200",
          subVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        )}
      >
        {t("hero.subtitle")}
      </p>

      {/* Email signup form */}
      <div
        ref={formRef}
        className={cn(
          "mt-10 w-full max-w-xl transition-all duration-700 delay-300",
          formVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        )}
      >
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-0 rounded-xl border border-[rgba(15,15,14,0.1)] bg-white p-1.5 shadow-[0_12px_40px_-20px_rgba(15,15,14,0.08)]"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 border-0 bg-transparent px-4 py-2.5 text-sm text-[#0F0F0E] placeholder:text-[#7A7870] outline-none"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center gap-2 rounded-[10px] bg-[#0F0F0E] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#2a2a28] active:scale-[0.98]"
            >
              {t("hero.cta")}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
      </div>

      {/* Meta row */}
      <div
        ref={metaRef}
        className={cn(
          "mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 transition-all duration-700 delay-400",
          metaVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}
      >
        {["hero.meta1", "hero.meta2", "hero.meta3", "hero.meta4"].map((key) => (
          <span key={key} className="text-xs text-[#7A7870]">
            {t(key)}
          </span>
        ))}
      </div>
    </section>
  );
}
