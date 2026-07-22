import type { TaxRate } from "@/types";

/** Sensible starter tax presets an organization can edit or delete in Settings. */
export const DEFAULT_TAX_RATES: TaxRate[] = [
  { id: "none", label: "No Tax", kind: "none", rate: 0, isDefault: true },
  { id: "vat-20", label: "VAT 20%", kind: "vat", rate: 20 },
  { id: "gst-10", label: "GST 10%", kind: "gst", rate: 10 },
  { id: "sales-tax-8", label: "Sales Tax 8%", kind: "sales_tax", rate: 8 },
];
