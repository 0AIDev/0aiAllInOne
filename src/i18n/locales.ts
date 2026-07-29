export const locales = ["en", "it", "fr", "de", "es", "zh", "ja"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  it: "Italiano",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  zh: "中文",
  ja: "日本語",
};
