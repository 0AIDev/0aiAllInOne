"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "@/i18n/locale-provider";

export function ContactForm() {
  const { t } = useLocale();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-[#0F0F0E]">{t("contact.messageSent")}</h3>
        <p className="mt-2 text-sm text-[#7A7870]">{t("contact.messageSentDesc")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-8 space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#0F0F0E]">
          {t("contact.formName")}
        </label>
        <input
          id="name"
          type="text"
          required
          className="mt-1.5 block w-full rounded-[10px] border border-[rgba(15,15,14,0.08)] bg-[#F9F9F6] px-4 py-2.5 text-sm text-[#0F0F0E] placeholder-[#7A7870] outline-none transition-colors focus:border-[rgba(15,15,14,0.2)] focus:ring-2 focus:ring-[rgba(15,15,14,0.06)]"
          placeholder={t("contact.formNamePlaceholder")}
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#0F0F0E]">
          {t("contact.formEmail")}
        </label>
        <input
          id="email"
          type="email"
          required
          className="mt-1.5 block w-full rounded-[10px] border border-[rgba(15,15,14,0.08)] bg-[#F9F9F6] px-4 py-2.5 text-sm text-[#0F0F0E] placeholder-[#7A7870] outline-none transition-colors focus:border-[rgba(15,15,14,0.2)] focus:ring-2 focus:ring-[rgba(15,15,14,0.06)]"
          placeholder={t("contact.formEmailPlaceholder")}
        />
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-[#0F0F0E]">
          {t("contact.formSubject")}
        </label>
        <input
          id="subject"
          type="text"
          required
          className="mt-1.5 block w-full rounded-[10px] border border-[rgba(15,15,14,0.08)] bg-[#F9F9F6] px-4 py-2.5 text-sm text-[#0F0F0E] placeholder-[#7A7870] outline-none transition-colors focus:border-[rgba(15,15,14,0.2)] focus:ring-2 focus:ring-[rgba(15,15,14,0.06)]"
          placeholder={t("contact.formSubjectPlaceholder")}
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[#0F0F0E]">
          {t("contact.formMessage")}
        </label>
        <textarea
          id="message"
          required
          rows={5}
          className="mt-1.5 block w-full rounded-[10px] border border-[rgba(15,15,14,0.08)] bg-[#F9F9F6] px-4 py-2.5 text-sm text-[#0F0F0E] placeholder-[#7A7870] outline-none transition-colors focus:border-[rgba(15,15,14,0.2)] focus:ring-2 focus:ring-[rgba(15,15,14,0.06)] resize-y"
          placeholder={t("contact.formMessagePlaceholder")}
        />
      </div>
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-[10px] bg-[#0F0F0E] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#3A3A37]"
      >
        {t("contact.sendMessage")}
      </button>
    </form>
  );
}
