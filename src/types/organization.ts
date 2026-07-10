import type { Address, CurrencyCode, LanguageTag, Timestamps } from "./common";

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

export interface Organization extends Timestamps {
  id: string;
  ownerId: string;
  name: string;
  legalName?: string;
  logoUrl?: string | null;
  email?: string;
  phone?: string;
  website?: string;
  address?: Address;
  taxId?: string;
  registrationNumber?: string;
  settings: OrganizationSettings;
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
