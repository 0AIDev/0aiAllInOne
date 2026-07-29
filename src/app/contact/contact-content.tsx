"use client";

import { useLocale } from "@/i18n/locale-provider";
import { Mail, MessageCircle, Twitter } from "lucide-react";
import { ContactForm } from "./contact-form";

export function ContactContent() {
  const { t } = useLocale();
  return (
    <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-[clamp(32px,5vw,48px)] font-medium leading-[1.1] tracking-[-0.02em] text-[#0F0F0E]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
        <em className="italic" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
          {t("contact.title")}
        </em>
      </h1>
      <p className="mt-4 text-lg text-[#3A3A37]">{t("contact.subtitle")}</p>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(15,15,14,0.04)]">
                <Mail className="h-5 w-5 text-[#0F0F0E]" />
              </div>
              <div>
                <h3 className="font-medium text-[#0F0F0E]">{t("contact.email")}</h3>
                <p className="mt-1 text-sm text-[#7A7870]">
                  <a href="mailto:hello@ai0fy.dev" className="text-[#0F0F0E] underline underline-offset-2 decoration-[rgba(15,15,14,0.15)] hover:decoration-[rgba(15,15,14,0.3)]">
                    hello@ai0fy.dev
                  </a>
                </p>
                <p className="mt-0.5 text-sm text-[#7A7870]">{t("contact.emailDesc")}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(15,15,14,0.04)]">
                <Twitter className="h-5 w-5 text-[#0F0F0E]" />
              </div>
              <div>
                <h3 className="font-medium text-[#0F0F0E]">{t("contact.twitter")}</h3>
                <p className="mt-1 text-sm text-[#7A7870]">
                  <a href="https://x.com/ai0fy_dev" target="_blank" rel="noopener noreferrer" className="text-[#0F0F0E] underline underline-offset-2 decoration-[rgba(15,15,14,0.15)] hover:decoration-[rgba(15,15,14,0.3)]">
                    @ai0fy_dev
                  </a>
                </p>
                <p className="mt-0.5 text-sm text-[#7A7870]">{t("contact.twitterDesc")}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(15,15,14,0.04)]">
                <MessageCircle className="h-5 w-5 text-[#0F0F0E]" />
              </div>
              <div>
                <h3 className="font-medium text-[#0F0F0E]">{t("contact.discord")}</h3>
                <p className="mt-1 text-sm text-[#7A7870]">
                  <a href="https://discord.gg/ai0fy" target="_blank" rel="noopener noreferrer" className="text-[#0F0F0E] underline underline-offset-2 decoration-[rgba(15,15,14,0.15)] hover:decoration-[rgba(15,15,14,0.3)]">
discord.gg/ai0fy
                  </a>
                </p>
                <p className="mt-0.5 text-sm text-[#7A7870]">{t("contact.discordDesc")}</p>
              </div>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
