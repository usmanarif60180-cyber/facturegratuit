import type { CurrencyCode, LanguageTag } from "@/types";

export function formatCurrency(amount: number, currency: CurrencyCode, locale: LanguageTag = "en") {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function formatDate(iso: string, locale: LanguageTag = "en") {
  try {
    return new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "2-digit" }).format(
      new Date(iso)
    );
  } catch {
    return iso;
  }
}
