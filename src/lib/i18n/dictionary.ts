import { DEFAULT_LOCALE } from "./locales";

/**
 * Translation-ready content dictionary. English is fully populated; other
 * locales are intentionally left as partial overrides that fall back to
 * English for any missing key, so a locale can be filled in incrementally
 * without ever showing a blank string.
 *
 * This is a content layer only — it does not change routing or the current
 * (English-only) URL structure. Adopting it across components and wiring
 * locale-aware routing is a deliberate follow-up, not part of this pass.
 */
export const en = {
  nav: {
    features: "Features",
    pricing: "Pricing",
    about: "About",
    contact: "Contact",
    blog: "Blog",
    help: "Help Center",
    resources: "Resources",
    tools: "Free Tools",
    signIn: "Sign in",
    getStarted: "Get started free",
  },
  common: {
    loading: "Loading…",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    search: "Search",
    subscribe: "Subscribe",
    readMore: "Read more",
  },
  auth: {
    signInTitle: "Welcome back",
    signUpTitle: "Create your workspace",
    forgotPassword: "Forgot password?",
  },
} as const;

export type Dictionary = typeof en;

const DICTIONARIES: Partial<Record<string, Partial<Dictionary>>> = {
  en,
  // fr, it, es, de, nl, pt, ar, ur: populate as translations land.
};

function deepMerge<T extends Record<string, unknown>>(base: T, override: Partial<T>): T {
  const result = { ...base };
  for (const key of Object.keys(override) as (keyof T)[]) {
    const overrideValue = override[key];
    const baseValue = base[key];
    if (
      overrideValue &&
      baseValue &&
      typeof overrideValue === "object" &&
      typeof baseValue === "object" &&
      !Array.isArray(overrideValue)
    ) {
      result[key] = deepMerge(baseValue as Record<string, unknown>, overrideValue as Record<string, unknown>) as T[keyof T];
    } else if (overrideValue !== undefined) {
      result[key] = overrideValue as T[keyof T];
    }
  }
  return result;
}

export function getDictionary(locale: string = DEFAULT_LOCALE): Dictionary {
  const override = DICTIONARIES[locale];
  if (!override || locale === DEFAULT_LOCALE) return en;
  return deepMerge(en, override);
}
