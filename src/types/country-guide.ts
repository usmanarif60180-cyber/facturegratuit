export interface CountryGuide {
  code: string;
  slug: string;
  name: string;
  currency: string;
  currencySymbol: string;
  taxName: string;
  taxOverview: string;
  intro: string;
  requirements: string[];
  invoiceRules: string[];
  bestPractices: string[];
  legalNote: string;
}
