import type { CountryGuide } from "@/types/country-guide";

export const COUNTRY_GUIDES: CountryGuide[] = [
  {
    code: "FR",
    slug: "france",
    name: "France",
    currency: "EUR",
    currencySymbol: "€",
    taxName: "TVA (VAT)",
    taxOverview:
      "France applies TVA at a standard rate with several reduced rates for specific goods and services. Rates and thresholds are set by the French tax authority and can change — always confirm the current rate before invoicing.",
    intro:
      "France has clear, well-documented invoicing rules, and électronic invoicing (facturation électronique) is being progressively rolled out for B2B transactions. Getting the basics right from day one avoids having to reissue documents later.",
    requirements: [
      "A SIRET number (business registration number) for registered businesses",
      "A TVA (VAT) number if your business is VAT-registered",
      "'Mentions légales' — standard legal notices — on invoices and your website",
    ],
    invoiceRules: [
      "Sequential, gap-free invoice numbering",
      "Full name and address of both seller and buyer",
      "TVA number for both parties where applicable",
      "The applicable TVA rate and amount shown per line or in total",
      "Payment terms and any late-payment penalty clause",
    ],
    bestPractices: [
      "Keep invoices in a format compatible with France's e-invoicing rollout",
      "Retain invoices for the legally required period (typically several years)",
      "State payment terms clearly — France has statutory late-payment penalties",
    ],
    legalNote:
      "This page is a general overview, not legal or tax advice. French invoicing and TVA rules can change — confirm current requirements with a French accountant or the official tax administration (impots.gouv.fr).",
  },
  {
    code: "IT",
    slug: "italy",
    name: "Italy",
    currency: "EUR",
    currencySymbol: "€",
    taxName: "IVA (VAT)",
    taxOverview:
      "Italy applies IVA at a standard rate with reduced rates for certain categories of goods and services. Italy requires electronic invoicing (fatturazione elettronica) for most B2B and B2G transactions through the SDI system.",
    intro:
      "Italy's electronic invoicing requirement is one of the most established in the EU — invoices for domestic B2B and B2G transactions generally must be issued through the Sistema di Interscambio (SDI), not just emailed as a PDF.",
    requirements: [
      "A Partita IVA (VAT number) for VAT-registered businesses",
      "A Codice Fiscale (tax code) for the business and, where relevant, the client",
      "Registration with the SDI system for electronic invoice submission",
    ],
    invoiceRules: [
      "Sequential invoice numbering with no gaps",
      "Partita IVA and Codice Fiscale for both parties",
      "IVA rate and amount clearly shown",
      "Electronic transmission via SDI for domestic B2B/B2G invoices",
    ],
    bestPractices: [
      "Confirm whether your transaction type requires SDI submission",
      "Keep a digital archive of every invoice for the statutory retention period",
      "Double-check Codice Fiscale and Partita IVA formatting before sending",
    ],
    legalNote:
      "This page is a general overview, not legal or tax advice. Confirm current IVA rates and e-invoicing obligations with an Italian commercialista or the Agenzia delle Entrate.",
  },
  {
    code: "DE",
    slug: "germany",
    name: "Germany",
    currency: "EUR",
    currencySymbol: "€",
    taxName: "MwSt / USt (VAT)",
    taxOverview:
      "Germany applies Mehrwertsteuer (MwSt), also referred to as Umsatzsteuer (USt), at a standard rate with a reduced rate for certain goods and services. Small businesses (Kleinunternehmer) may qualify for a VAT exemption below a revenue threshold.",
    intro:
      "German invoices (Rechnungen) have specific mandatory fields under the Umsatzsteuergesetz (UStG). Missing a required field is one of the most common reasons a German client's accounting team will reject an invoice.",
    requirements: [
      "A Steuernummer (tax number) or USt-IdNr (VAT ID) depending on your registration",
      "Confirmation of whether you qualify for the Kleinunternehmer (small business) VAT exemption",
      "A registered business address",
    ],
    invoiceRules: [
      "A unique, sequential invoice number",
      "Full name and address of both parties",
      "Tax number or VAT ID",
      "Date of issue and date of delivery/service, if different",
      "Net amount, VAT rate, VAT amount and gross total shown separately",
    ],
    bestPractices: [
      "State clearly if you're invoicing under the Kleinunternehmerregelung (no VAT charged)",
      "Keep invoices for the statutory retention period (typically several years)",
      "Use consistent, sequential numbering across your entire business, not per client",
    ],
    legalNote:
      "This page is a general overview, not legal or tax advice. Confirm current MwSt rates and invoice requirements with a Steuerberater (tax advisor) or the Bundeszentralamt für Steuern.",
  },
  {
    code: "ES",
    slug: "spain",
    name: "Spain",
    currency: "EUR",
    currencySymbol: "€",
    taxName: "IVA (VAT)",
    taxOverview:
      "Spain applies IVA at a standard rate with reduced rates for specific categories. Spain has been expanding electronic invoicing requirements, particularly for larger businesses and public-sector transactions.",
    intro:
      "Spanish invoices require a NIF or CIF (tax identification number) for both the issuer and, in most B2B cases, the recipient. Freelancers (autónomos) and companies follow largely the same core invoicing rules.",
    requirements: [
      "A NIF (for individuals) or CIF (for companies) tax identification number",
      "Registration as autónomo or a registered company structure",
      "Awareness of your obligations under Spain's evolving e-invoicing rules",
    ],
    invoiceRules: [
      "Sequential invoice numbering, typically reset annually",
      "Full name, address and NIF/CIF for both parties",
      "IVA rate and amount shown, or a note if the operation is IVA-exempt",
      "Date of issue",
    ],
    bestPractices: [
      "Keep a clean annual invoice sequence — Spanish tax authorities expect no gaps",
      "Retain invoices for the statutory period required by the Agencia Tributaria",
      "Confirm current e-invoicing obligations if you work with public administration clients",
    ],
    legalNote:
      "This page is a general overview, not legal or tax advice. Confirm current IVA rates and requirements with a gestor/asesor fiscal or the Agencia Tributaria.",
  },
  {
    code: "GB",
    slug: "uk",
    name: "United Kingdom",
    currency: "GBP",
    currencySymbol: "£",
    taxName: "VAT",
    taxOverview:
      "The UK applies VAT at a standard rate, with reduced and zero rates for specific goods and services. VAT registration becomes mandatory once your taxable turnover crosses HMRC's current threshold — check gov.uk for the up-to-date figure, as it is reviewed periodically.",
    intro:
      "UK invoicing rules are set by HMRC and are relatively light-touch for non-VAT-registered businesses, but become more prescriptive once you register for VAT.",
    requirements: [
      "A unique invoice number",
      "Your business name and address (and VAT number, once registered)",
      "The client's name and address",
    ],
    invoiceRules: [
      "A clear description of the goods or services provided",
      "Date of supply and invoice date",
      "Total amount owed, and VAT breakdown if VAT-registered",
      "Your payment terms",
    ],
    bestPractices: [
      "Monitor your rolling 12-month turnover against the current VAT threshold",
      "Keep digital records if you're within HMRC's Making Tax Digital requirements",
      "State payment terms clearly — late payment legislation gives you the right to charge statutory interest",
    ],
    legalNote:
      "This page is a general overview, not legal or tax advice. Confirm current VAT thresholds and rules directly on gov.uk or with a UK accountant.",
  },
  {
    code: "US",
    slug: "usa",
    name: "United States",
    currency: "USD",
    currencySymbol: "$",
    taxName: "Sales Tax",
    taxOverview:
      "The US has no federal VAT or general sales tax. Instead, sales tax is set at the state level (and often city or county level too), so the correct rate depends entirely on where your sale is deemed to take place — and whether your business has 'nexus' in that state.",
    intro:
      "There's no single federal invoicing standard in the US, which gives businesses flexibility — but it also means sales tax compliance is more fragmented than in VAT/GST countries, especially once you sell across multiple states.",
    requirements: [
      "An EIN (Employer Identification Number) or SSN for sole proprietors, for tax filing",
      "A sales tax permit in any state where you have nexus and sell taxable goods/services",
      "Awareness of which of your products or services are taxable in each relevant state",
    ],
    invoiceRules: [
      "A unique invoice number",
      "Your business name and contact details",
      "The client's name and billing address",
      "Sales tax shown separately if applicable, at the correct state/local rate",
    ],
    bestPractices: [
      "Track nexus — the connection that requires you to collect tax in a given state — as your business grows",
      "Keep invoices and payment records for IRS reporting purposes",
      "Use clear, consistent invoice numbering even though the US has no legal numbering mandate",
    ],
    legalNote:
      "This page is a general overview, not legal or tax advice. Confirm your sales tax obligations with a US CPA — rules vary significantly by state.",
  },
  {
    code: "CA",
    slug: "canada",
    name: "Canada",
    currency: "CAD",
    currencySymbol: "CA$",
    taxName: "GST/HST (+ PST/QST in some provinces)",
    taxOverview:
      "Canada applies a federal Goods and Services Tax (GST). Several provinces harmonize it with their own provincial tax into a single Harmonized Sales Tax (HST), while others apply a separate Provincial Sales Tax (PST) or, in Quebec, the QST — meaning the total rate a client pays depends on their province.",
    intro:
      "Canadian invoicing is relatively straightforward federally, but the tax portion depends on which province your client is in, and whether you're registered to collect GST/HST.",
    requirements: [
      "A Business Number (BN) from the CRA once you're required to register for GST/HST",
      "Registration for GST/HST once you exceed the small-supplier revenue threshold",
      "Awareness of your client's province for the correct tax treatment",
    ],
    invoiceRules: [
      "A unique invoice number",
      "Your business name, address and GST/HST number once registered",
      "The applicable GST/HST (and PST/QST where relevant) shown separately",
      "Date of supply",
    ],
    bestPractices: [
      "Confirm your client's province before finalizing tax on cross-province invoices",
      "Keep records for the CRA's required retention period",
      "Register proactively once you're close to the small-supplier threshold, not after",
    ],
    legalNote:
      "This page is a general overview, not legal or tax advice. Confirm current GST/HST/PST rates and thresholds with a Canadian accountant or the CRA.",
  },
];

export function getCountryGuide(slug: string) {
  return COUNTRY_GUIDES.find((c) => c.slug === slug);
}
