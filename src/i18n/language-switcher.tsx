"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "@/i18n/locale-provider";
import { Check } from "lucide-react";
import "flag-icons/css/flag-icons.min.css";

const COUNTRY_MAP: Record<string, string> = {
  en: "gb",
  it: "it",
  fr: "fr",
  de: "de",
  es: "es",
  zh: "cn",
  ja: "jp",
};

export function LanguageSwitcher() {
  const { locale, setLocale, locales, localeNames } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-[rgba(15,15,14,0.08)] bg-white px-3 py-2 text-xs font-medium text-[#3A3A37] transition-colors hover:border-[rgba(15,15,14,0.15)] hover:text-[#0F0F0E]"
      >
        <span className={`fi fi-${COUNTRY_MAP[locale]} h-3.5 w-3.5 rounded-sm`} />
        <span>{localeNames[locale]}</span>
      </button>
      {open && (
        <div className="absolute right-0 z-50 bottom-full mb-1 w-44 rounded-xl border border-[rgba(15,15,14,0.08)] bg-white py-1.5 shadow-[0_8px_30px_rgba(15,15,14,0.1)]">
          {locales.map((loc) => {
            const active = loc === locale;
            return (
              <button
                key={loc}
                onClick={() => { setLocale(loc); setOpen(false); }}
                className={`flex w-full items-center gap-3 px-3.5 py-2 text-left text-xs font-medium transition-colors ${
                  active ? "text-[#0F0F0E]" : "text-[#7A7870] hover:text-[#0F0F0E] hover:bg-[rgba(15,15,14,0.03)]"
                }`}
              >
                <span className={`fi fi-${COUNTRY_MAP[loc]} h-3.5 w-3.5 rounded-sm`} />
                <span className="flex-1">{localeNames[loc]}</span>
                {active && <Check className="h-3.5 w-3.5 text-[#0F0F0E]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
