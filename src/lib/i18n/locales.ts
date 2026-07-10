export interface LocaleDefinition {
  code: string;
  label: string;
  nativeLabel: string;
  direction: "ltr" | "rtl";
}

/**
 * Locales the content system is designed to support. Only "en" ships fully
 * translated today (see dictionary.ts) — this list exists so the rest of
 * the platform (language pickers, generated <html lang>, future content
 * translation) can be built against a stable, shared source of truth.
 */
export const SUPPORTED_LOCALES: LocaleDefinition[] = [
  { code: "en", label: "English", nativeLabel: "English", direction: "ltr" },
  { code: "fr", label: "French", nativeLabel: "Français", direction: "ltr" },
  { code: "it", label: "Italian", nativeLabel: "Italiano", direction: "ltr" },
  { code: "es", label: "Spanish", nativeLabel: "Español", direction: "ltr" },
  { code: "de", label: "German", nativeLabel: "Deutsch", direction: "ltr" },
  { code: "nl", label: "Dutch", nativeLabel: "Nederlands", direction: "ltr" },
  { code: "pt", label: "Portuguese", nativeLabel: "Português", direction: "ltr" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", direction: "rtl" },
  { code: "ur", label: "Urdu", nativeLabel: "اردو", direction: "rtl" },
];

export const DEFAULT_LOCALE = "en";

export function getLocaleDefinition(code: string): LocaleDefinition {
  return SUPPORTED_LOCALES.find((l) => l.code === code) ?? SUPPORTED_LOCALES[0]!;
}
