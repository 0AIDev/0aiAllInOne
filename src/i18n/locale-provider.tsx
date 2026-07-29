"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { getCookie, setCookie } from "cookies-next";
import en from "../../messages/en.json";
import it from "../../messages/it.json";
import fr from "../../messages/fr.json";
import de from "../../messages/de.json";
import es from "../../messages/es.json";
import zh from "../../messages/zh.json";
import ja from "../../messages/ja.json";

export type Locale = "en" | "it" | "fr" | "de" | "es" | "zh" | "ja";

const locales: Locale[] = ["en", "it", "fr", "de", "es", "zh", "ja"];
const localeNames: Record<Locale, string> = {
  en: "English", it: "Italiano", fr: "Français", de: "Deutsch",
  es: "Español", zh: "中文", ja: "日本語",
};

const allMessages: Record<Locale, Record<string, unknown>> = { en, it, fr, de, es, zh, ja };

interface LocaleContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: (key: string) => string;
  locales: Locale[];
  localeNames: Record<Locale, string>;
}

function getMessages(loc: Locale): Record<string, unknown> {
  return allMessages[loc] ?? en;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let value: unknown = obj;
  for (const k of keys) {
    if (value && typeof value === "object" && k in (value as Record<string, unknown>)) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return path;
    }
  }
  return typeof value === "string" ? value : path;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [messages, setMessages] = useState<Record<string, unknown>>(getMessages("en"));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = getCookie("locale") as Locale | undefined;
    const initial = saved && locales.includes(saved) ? saved : "en";
    setLocaleState(initial);
    setMessages(getMessages(initial));
    setReady(true);
  }, []);

  const setLocale = useCallback((loc: Locale) => {
    setLocaleState(loc);
    setCookie("locale", loc, { maxAge: 31536000, path: "/" });
    setMessages(getMessages(loc));
  }, []);

  const t = useCallback((key: string): string => {
    return getNestedValue(messages, key);
  }, [messages]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, locales, localeNames }}>
      {ready ? children : <div className="min-h-screen bg-[#F9F9F6]" />}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
