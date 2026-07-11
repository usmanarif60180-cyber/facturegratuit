import type { Address, CurrencyCode, LanguageTag, Timestamps } from "./common";
import type { BrandKit, DesignConfig } from "./design";

export interface OrganizationSettings {
  defaultCurrency: CurrencyCode;
  defaultLanguage: LanguageTag;
  /** IANA timezone, e.g. "Europe/Paris". */
  timeZone: string;
  /** e.g. "DD/MM/YYYY" — never hardcoded per-locale in components. */
  dateFormat: string;
  invoicePrefix: string;
  quotePrefix: string;
  nextInvoiceNumber: number;
  nextQuoteNumber: number;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
}

export interface Organization extends Timestamps {
  id: string;
  ownerId: string;
  name: string;
  legalName?: string;
  /** Industry preset id (see src/lib/design/industries.ts) — drives the
   * company creation wizard's suggested branding and doubles as the
   * "Business Type" shown on the company profile. */
  businessType?: string;
  logoUrl?: string | null;
  email?: string;
  phone?: string;
  website?: string;
  address?: Address;
  taxId?: string;
  vatNumber?: string;
  registrationNumber?: string;
  businessLicenseNumber?: string;
  socialLinks?: SocialLinks;
  settings: OrganizationSettings;
  /** Active Invoice & Quote Design Studio configuration. Falls back to
   * DEFAULT_DESIGN_CONFIG when unset. */
  designConfig?: DesignConfig;
  brandKit?: BrandKit;
  /** Template id preferred for new invoices/quotes when no custom
   * designConfig override is active (see src/lib/design/templates.ts). */
  defaultInvoiceTemplateId?: string;
  defaultQuoteTemplateId?: string;
}

export const DEFAULT_ORGANIZATION_SETTINGS: OrganizationSettings = {
  defaultCurrency: "USD",
  defaultLanguage: "en",
  timeZone: "UTC",
  dateFormat: "YYYY-MM-DD",
  invoicePrefix: "INV-",
  quotePrefix: "QUO-",
  nextInvoiceNumber: 1,
  nextQuoteNumber: 1,
};
