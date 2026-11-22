"use client";

import { LuLanguages, LuCheck } from "react-icons/lu";
import { useLocale, useSetLocale } from "@/lib/i18n";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LOCALE_FLAGS: Record<Locale, string> = {
  vi: "🇻🇳",
  en: "🇬🇧",
  zh: "🇨🇳",
};

/**
 * Language selector: Chinese ⇄ English ⇄ Vietnamese.
 * Shows a dropdown menu to select the UI language directly, persisted in settings store.
 */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const setLocale = useSetLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Change language"
        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer ${className}`}
      >
        <LuLanguages className="w-3.5 h-3.5" />
        <span>{LOCALE_FLAGS[locale]} {LOCALE_LABELS[locale]}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => setLocale(l)}
            className="flex items-center justify-between text-xs cursor-pointer py-1.5"
          >
            <span className="flex items-center gap-2">
              <span>{LOCALE_FLAGS[l]}</span>
              <span>{LOCALE_LABELS[l]}</span>
            </span>
            {locale === l && <LuCheck className="w-3.5 h-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
