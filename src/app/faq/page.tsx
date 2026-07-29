"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/i18n/locale-provider";

export default function FAQPage() {
  const { t } = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = Array.from({ length: 10 }, (_, i) => ({
    question: t(`faq.q${i + 1}`),
    answer: t(`faq.a${i + 1}`),
  }));

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
              <em
                className="italic"
                style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
              >
                {t("faq.title")}
              </em>
            </h1>
            <p className="mt-4 text-lg text-[#3A3A37]">
              {t("faq.subtitle")}
            </p>

            <div className="mt-12 space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white transition-all"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="flex w-full items-center justify-between px-6 py-5 text-left text-[#0F0F0E] font-medium"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-[#7A7870] transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-0 text-[#3A3A37] leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
