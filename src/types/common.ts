/** Shared primitive types used across every domain model. */

export interface Timestamps {
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface Address {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  /** ISO 3166-1 alpha-2 country code. Never hardcode a country name. */
  countryCode?: string;
}

/** ISO 4217 currency code, e.g. "USD", "EUR", "GBP". */
export type CurrencyCode = string;

/** BCP 47 language tag, e.g. "en", "fr", "es-ES". */
export type LanguageTag = string;

export type TaxKind = "vat" | "gst" | "sales_tax" | "custom" | "none";

export interface TaxRate {
  id: string;
  label: string;
  kind: TaxKind;
  /** Percentage value, e.g. 20 for 20%. */
  rate: number;
  isDefault?: boolean;
}

export type DiscountType = "percentage" | "fixed";

export interface LineItem {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRateId?: string;
  discount?: { type: DiscountType; value: number };
}

export interface DocumentTotals {
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
  amountPaid?: number;
  amountDue?: number;
}

export type SortDirection = "asc" | "desc";

export interface PaginatedQuery {
  pageSize?: number;
  cursor?: string;
}
