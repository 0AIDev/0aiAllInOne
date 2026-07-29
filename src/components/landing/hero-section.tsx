"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Circle } from "lucide-react";

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
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      {/* Eyebrow badge */}
      <div
        ref={badgeRef}
        className={cn(
          "mb-10 inline-flex items-center gap-2.5 rounded-full border border-[rgba(15,15,14,0.1)] bg-white px-4 py-1.5 text-xs font-medium text-[#3A3A37] transition-all duration-700",
          badgeVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        )}
      >
        <Circle className="h-2 w-2 fill-[#10b981] text-[#10b981]" />
        {t("hero.badge")}
      </div>

      {/* Main heading */}
      <div className="relative">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ zIndex: -1 }} aria-hidden="true">
          <svg width="520" height="420" viewBox="-20 -20 480 380" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="heroZigzag" x1="200" y1="0" x2="200" y2="320" gradientUnits="userSpaceOnUse">
                <stop stopOpacity="0.5" stopColor="#444444" />
                <stop offset="0.5" stopOpacity="0.2" stopColor="#2a2a2a" />
                <stop offset="1" stopOpacity="0.05" stopColor="#1a1a1a" />
              </linearGradient>
              <filter id="heroZBlur" x="-20" y="-20" width="480" height="380">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" />
              </filter>
            </defs>
            <path d="M398.97 0.5L147.576 319.5H1.03027L37.5996 273.081L120.167 169.603L120.171 169.598L215.342 47.5605L215.343 47.5615L252.424 0.5H398.97ZM264.544 273.271H372.527L336.082 319.498H189.886L202.642 303.307C217.584 284.34 240.398 273.271 264.544 273.271ZM209.164 0.5L202.786 8.58887C183.782 32.6885 154.782 46.752 124.091 46.752H25.9805L62.4268 0.5H209.164Z" fill="url(#heroZigzag)" filter="url(#heroZBlur)" opacity="0.15" />
            <path d="M398.97 0.5L147.576 319.5H1.03027L37.5996 273.081L120.167 169.603L120.171 169.598L215.342 47.5605L215.343 47.5615L252.424 0.5H398.97ZM264.544 273.271H372.527L336.082 319.498H189.886L202.642 303.307C217.584 284.34 240.398 273.271 264.544 273.271ZM209.164 0.5L202.786 8.58887C183.782 32.6885 154.782 46.752 124.091 46.752H25.9805L62.4268 0.5H209.164Z" stroke="url(#heroZigzag)" strokeWidth="1" fill="none" opacity="0.08" />
          </svg>
        </div>
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
      </div>

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
