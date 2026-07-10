import type { Client, Invoice, Organization, Quote } from "@/types";

const now = "2026-07-10T00:00:00.000Z";

export const BLANK_ORGANIZATION: Organization = {
  id: "sample-org",
  ownerId: "sample-owner",
  name: "Your Business Name",
  email: "you@yourbusiness.com",
  address: { city: "Your City", countryCode: "US" },
  settings: {
    defaultCurrency: "USD",
    defaultLanguage: "en",
    timeZone: "UTC",
    dateFormat: "YYYY-MM-DD",
    invoicePrefix: "INV-",
    quotePrefix: "QUO-",
    nextInvoiceNumber: 1,
    nextQuoteNumber: 1,
  },
  createdAt: now,
  updatedAt: now,
};

export const EXAMPLE_ORGANIZATION: Organization = {
  ...BLANK_ORGANIZATION,
  name: "Nova Digital Agency",
  email: "hello@novadigital.com",
  address: { city: "Austin", countryCode: "US" },
};

export const BLANK_CLIENT: Client = {
  id: "sample-client",
  organizationId: "sample-org",
  displayName: "Client Name",
  email: "client@example.com",
  address: { city: "Client City", countryCode: "US" },
  createdAt: now,
  updatedAt: now,
};

export const EXAMPLE_CLIENT: Client = {
  ...BLANK_CLIENT,
  displayName: "Atlas Studio",
  email: "accounts@atlasstudio.io",
  address: { city: "Denver", countryCode: "US" },
};

export const BLANK_INVOICE: Invoice = {
  id: "sample-invoice",
  organizationId: "sample-org",
  clientId: "sample-client",
  number: "INV-0001",
  status: "draft",
  issueDate: now,
  dueDate: now,
  currency: "USD",
  lineItems: [
    { id: "li1", description: "Item or service description", quantity: 1, unitPrice: 0 },
    { id: "li2", description: "Item or service description", quantity: 1, unitPrice: 0 },
  ],
  totals: { subtotal: 0, discountTotal: 0, taxTotal: 0, total: 0 },
  notes: "Thank you for your business.",
  terms: "Payment due within 14 days.",
  createdAt: now,
  updatedAt: now,
};

export const EXAMPLE_INVOICE: Invoice = {
  ...BLANK_INVOICE,
  clientId: "example-client",
  number: "INV-0042",
  status: "paid",
  lineItems: [
    { id: "li1", description: "Brand identity package", quantity: 1, unitPrice: 1800 },
    { id: "li2", description: "Website design — 5 pages", quantity: 1, unitPrice: 2400 },
    { id: "li3", description: "Revision round", quantity: 2, unitPrice: 150 },
  ],
  totals: { subtotal: 4500, discountTotal: 0, taxTotal: 0, total: 4500 },
  notes: "Thank you for choosing Nova Digital Agency.",
  terms: "Payment due within 14 days of invoice date.",
};

export const BLANK_QUOTE: Quote = {
  id: "sample-quote",
  organizationId: "sample-org",
  clientId: "sample-client",
  number: "QUO-0001",
  status: "draft",
  issueDate: now,
  expiryDate: now,
  currency: "USD",
  lineItems: [
    { id: "li1", description: "Item or service description", quantity: 1, unitPrice: 0 },
    { id: "li2", description: "Item or service description", quantity: 1, unitPrice: 0 },
  ],
  totals: { subtotal: 0, discountTotal: 0, taxTotal: 0, total: 0 },
  notes: "This quote is valid for 30 days.",
  createdAt: now,
  updatedAt: now,
};

export const EXAMPLE_QUOTE: Quote = {
  ...BLANK_QUOTE,
  clientId: "example-client",
  number: "QUO-0018",
  status: "sent",
  lineItems: [
    { id: "li1", description: "Logistics tracking module — implementation", quantity: 1, unitPrice: 3200 },
    { id: "li2", description: "Staff training (half day)", quantity: 1, unitPrice: 600 },
  ],
  totals: { subtotal: 3800, discountTotal: 0, taxTotal: 0, total: 3800 },
  notes: "Quote valid for 30 days from issue date.",
};
