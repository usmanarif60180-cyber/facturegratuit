export interface CountryOption {
  /** ISO 3166-1 alpha-2 */
  code: string;
  name: string;
  defaultCurrency: string;
  defaultTaxLabel: string;
}

export const COUNTRIES: CountryOption[] = [
  { code: "US", name: "United States", defaultCurrency: "USD", defaultTaxLabel: "Sales Tax" },
  { code: "GB", name: "United Kingdom", defaultCurrency: "GBP", defaultTaxLabel: "VAT" },
  { code: "FR", name: "France", defaultCurrency: "EUR", defaultTaxLabel: "TVA" },
  { code: "DE", name: "Germany", defaultCurrency: "EUR", defaultTaxLabel: "MwSt" },
  { code: "ES", name: "Spain", defaultCurrency: "EUR", defaultTaxLabel: "IVA" },
  { code: "IT", name: "Italy", defaultCurrency: "EUR", defaultTaxLabel: "IVA" },
  { code: "CA", name: "Canada", defaultCurrency: "CAD", defaultTaxLabel: "GST/HST" },
  { code: "AU", name: "Australia", defaultCurrency: "AUD", defaultTaxLabel: "GST" },
  { code: "IN", name: "India", defaultCurrency: "INR", defaultTaxLabel: "GST" },
  { code: "PK", name: "Pakistan", defaultCurrency: "PKR", defaultTaxLabel: "Sales Tax" },
  { code: "AE", name: "United Arab Emirates", defaultCurrency: "AED", defaultTaxLabel: "VAT" },
  { code: "SA", name: "Saudi Arabia", defaultCurrency: "SAR", defaultTaxLabel: "VAT" },
  { code: "ZA", name: "South Africa", defaultCurrency: "ZAR", defaultTaxLabel: "VAT" },
  { code: "BR", name: "Brazil", defaultCurrency: "BRL", defaultTaxLabel: "ICMS" },
  { code: "MX", name: "Mexico", defaultCurrency: "MXN", defaultTaxLabel: "IVA" },
  { code: "SG", name: "Singapore", defaultCurrency: "SGD", defaultTaxLabel: "GST" },
  { code: "NZ", name: "New Zealand", defaultCurrency: "NZD", defaultTaxLabel: "GST" },
  { code: "NL", name: "Netherlands", defaultCurrency: "EUR", defaultTaxLabel: "BTW" },
  { code: "SE", name: "Sweden", defaultCurrency: "SEK", defaultTaxLabel: "Moms" },
  { code: "JP", name: "Japan", defaultCurrency: "JPY", defaultTaxLabel: "Consumption Tax" },
];
