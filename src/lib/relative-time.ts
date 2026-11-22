/**
 * Relative time formatting based on the native Intl.RelativeTimeFormat API.
 * Zero-dependency; safe for both client and server components.
 */

import type { Locale } from "@/lib/i18n/config";

/** Unit thresholds from largest to smallest, expressed in seconds. */
const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

/**
 * Format a timestamp as a localized relative time string, e.g. "3 小时前" / "3 hours ago" / "3 giờ trước".
 *
 * Picks the largest unit that fits the elapsed time; sub-minute values render as
 * "now"-style output thanks to `numeric: "auto"`. Works for future timestamps too
 * ("in 2 days"), though callers here mostly pass past times.
 *
 * @param iso - ISO date string, Date instance, or null.
 * @param locale - UI locale, "zh", "en", or "vi".
 * @returns The localized relative time, or an empty string for null/invalid input.
 */
export function formatRelativeTime(iso: string | Date | null, locale: Locale | "zh" | "en" | "vi" | string): string {
  if (!iso) return "";
  const time = (iso instanceof Date ? iso : new Date(iso)).getTime();
  if (!Number.isFinite(time)) return "";

  const diffSec = Math.round((time - Date.now()) / 1000);
  const intlLocale = locale === "zh" ? "zh-CN" : locale === "vi" ? "vi-VN" : "en";
  const rtf = new Intl.RelativeTimeFormat(intlLocale, { numeric: "auto" });
  const abs = Math.abs(diffSec);
  for (const [unit, seconds] of UNITS) {
    if (abs >= seconds) return rtf.format(Math.trunc(diffSec / seconds), unit);
  }
  // Under a minute: numeric:"auto" renders 0 seconds as "now" / "现在" / "vừa xong"
  return rtf.format(0, "second");
}
