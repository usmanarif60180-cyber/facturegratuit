import type { ResourceItem } from "@/types/resource";

export const RESOURCE_ITEMS: ResourceItem[] = [
  {
    slug: "invoice-template",
    title: "Free Invoice Template",
    description: "A clean, ready-to-use invoice template — fill in your details and print or save as PDF.",
    category: "Invoice Templates",
    kind: "invoice",
    variant: "blank",
  },
  {
    slug: "invoice-example",
    title: "Invoice Example (Filled In)",
    description: "See a complete, real-world invoice example with sample line items and totals.",
    category: "Invoice Examples",
    kind: "invoice",
    variant: "example",
  },
  {
    slug: "quote-template",
    title: "Free Quote Template",
    description: "A professional quotation template ready to customize for your next proposal.",
    category: "Quote Templates",
    kind: "quote",
    variant: "blank",
  },
  {
    slug: "quote-example",
    title: "Quote Example (Filled In)",
    description: "A complete quote example showing how line items, totals and terms come together.",
    category: "Quote Examples",
    kind: "quote",
    variant: "example",
  },
  {
    slug: "receipt-template",
    title: "Free Receipt Template",
    description: "A simple payment receipt template for confirming payment in full.",
    category: "Receipt Templates",
    kind: "receipt",
  },
  {
    slug: "purchase-order-template",
    title: "Free Purchase Order Template",
    description: "A purchase order template for ordering goods or services from a vendor.",
    category: "Purchase Order Templates",
    kind: "purchase-order",
  },
  {
    slug: "new-client-onboarding-checklist",
    title: "New Client Onboarding Checklist",
    description: "Everything to do before starting work with a new client, from contract to kickoff.",
    category: "Business Checklists",
    kind: "checklist",
    content: [
      { type: "list", ordered: true, items: [
        "Send a written quote or proposal and get it accepted",
        "Collect the client's full business details (name, address, tax/VAT number)",
        "Sign a contract or statement of work covering scope, timeline and payment terms",
        "Set up the client in your invoicing system",
        "Agree on invoicing milestones or schedule",
        "Confirm the point of contact and preferred communication channel",
        "Schedule a kickoff call or meeting",
        "Send a welcome email summarizing next steps",
      ] },
    ],
  },
  {
    slug: "year-end-business-document-checklist",
    title: "Year-End Business Document Checklist",
    description: "The documents to gather before closing your books for the year.",
    category: "Business Documents",
    kind: "checklist",
    content: [
      { type: "list", ordered: true, items: [
        "All issued invoices for the year, with payment status",
        "All received receipts and expense records, sorted by category",
        "Bank and payment processor statements for every month",
        "Any outstanding or overdue invoices, flagged for follow-up",
        "Mileage or travel logs, if applicable",
        "Contractor or subcontractor payment records",
        "Prior year's tax filing, for reference",
        "A simple profit and loss summary for the year",
      ] },
    ],
  },
];

export function getResourceBySlug(slug: string): ResourceItem | undefined {
  return RESOURCE_ITEMS.find((r) => r.slug === slug);
}
