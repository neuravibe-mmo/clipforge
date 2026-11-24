"use client";

import { useState, useRef, useEffect } from "react";
import { LuLanguages, LuCheck, LuChevronDown } from "react-icons/lu";
import { useLocale, useSetLocale } from "@/lib/i18n";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export const LOCALE_FLAGS: Record<Locale, string> = {
  vi: "🇻🇳",
  en: "🇬🇧",
  zh: "🇨🇳",
};

export interface LanguageToggleProps {
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  collapsed?: boolean;
  showChevron?: boolean;
}

/**
 * Language selector: Chinese ⇄ English ⇄ Vietnamese.
 * Pure React implementation with zero external popup dependencies to guarantee
 * instant, reliable clicks and reactive state updates.
 */
export function LanguageToggle({
  className = "",
  side = "top",
  align = "start",
  collapsed = false,
  showChevron = false,
}: LanguageToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const setLocale = useSetLocale();

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (l: Locale) => {
    setLocale(l);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left whitespace-nowrap">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Change language"
        aria-expanded={isOpen}
        title={LOCALE_LABELS[locale]}
        className={cn(
          "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer select-none",
          collapsed && "h-7 w-7 justify-center p-0",
          className
        )}
      >
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <LuLanguages className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
          {!collapsed && (
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-foreground font-medium">
              <span className="text-sm leading-none shrink-0">{LOCALE_FLAGS[locale]}</span>
              <span className="whitespace-nowrap shrink-0">{LOCALE_LABELS[locale]}</span>
            </span>
          )}
        </div>
        {showChevron && (
          <LuChevronDown
            className={cn(
              "w-3.5 h-3.5 shrink-0 text-muted-foreground/70 transition-transform duration-200 ml-auto",
              isOpen && "rotate-180 text-foreground"
            )}
          />
        )}
      </button>

      {isOpen && (
        <div
          role="menu"
          className={cn(
            "absolute z-50 min-w-[160px] rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md p-1.5 text-popover-foreground shadow-xl ring-1 ring-black/10 select-none",
            side === "top" && "bottom-full mb-2",
            side === "bottom" && "top-full mt-2",
            side === "right" && "left-full ml-2 bottom-0",
            side === "left" && "right-full mr-2 bottom-0",
            align === "start" && "left-0",
            align === "end" && "right-0",
            align === "center" && "left-1/2 -translate-x-1/2"
          )}
        >
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              role="menuitem"
              onClick={() => handleSelect(l)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-xs text-left transition-colors cursor-pointer select-none whitespace-nowrap",
                locale === l
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-sm leading-none shrink-0">{LOCALE_FLAGS[l]}</span>
                <span className="whitespace-nowrap">{LOCALE_LABELS[l]}</span>
              </span>
              {locale === l && <LuCheck className="w-3.5 h-3.5 text-primary shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
