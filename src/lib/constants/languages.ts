import type { LanguageTag } from "@/types";

export interface LanguageOption {
  tag: LanguageTag;
  label: string;
  nativeLabel: string;
}

export const LANGUAGES: LanguageOption[] = [
  { tag: "en", label: "English", nativeLabel: "English" },
  { tag: "fr", label: "French", nativeLabel: "Français" },
  { tag: "es", label: "Spanish", nativeLabel: "Español" },
  { tag: "de", label: "German", nativeLabel: "Deutsch" },
  { tag: "it", label: "Italian", nativeLabel: "Italiano" },
  { tag: "pt", label: "Portuguese", nativeLabel: "Português" },
  { tag: "ar", label: "Arabic", nativeLabel: "العربية" },
  { tag: "ur", label: "Urdu", nativeLabel: "اردو" },
  { tag: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { tag: "zh", label: "Chinese", nativeLabel: "中文" },
];
