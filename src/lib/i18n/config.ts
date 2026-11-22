/** Locale configuration: Chinese is the default/primary language; English and Vietnamese are switchable alternatives */
export const LOCALES = ["zh", "en", "vi"] as const;
export type Locale = (typeof LOCALES)[number];

/** Default locale: Chinese first */
export const DEFAULT_LOCALE: Locale = "zh";

/** Labels shown in the language switcher */
export const LOCALE_LABELS: Record<Locale, string> = {
  zh: "中文",
  en: "English",
  vi: "Tiếng Việt",
};

/** Multilingual message entries for a single namespace (one page/module) */
export interface NamespaceMessages {
  zh: Record<string, string>;
  en: Record<string, string>;
  vi?: Record<string, string>;
}

/**
 * Auto-detects the UI locale from the user's system/browser language.
 * Chinese systems -> zh; Vietnamese -> vi; everything else -> en.
 * Returns the default locale in environments without navigator (SSR).
 */
export function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const langs = (navigator.languages && navigator.languages.length
    ? navigator.languages
    : [navigator.language]) as string[];
  for (const l of langs) {
    if (!l) continue;
    const lower = l.toLowerCase();
    if (lower.startsWith("zh")) return "zh";
    if (lower.startsWith("vi")) return "vi";
  }
  return "en";
}
