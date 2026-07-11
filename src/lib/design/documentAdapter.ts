import type { DocumentTotals, Invoice, LineItem, Quote } from "@/types";

export type DesignableDocKind = "invoice" | "quote";

export type DesignableStatus =
  | "draft"
  | "pending"
  | "paid"
  | "overdue"
  | "canceled"
  | "sent"
  | "accepted"
  | "declined"
  | "expired"
  | "converted";

export interface DesignableDocumentData {
  kind: DesignableDocKind;
  number: string;
  status: DesignableStatus;
  issueDate: string;
  secondDateLabel: "dueDate" | "validUntil";
  secondDate: string;
  currency: string;
  lineItems: LineItem[];
  totals: DocumentTotals;
  notes?: string;
  terms?: string;
  qrCodeUrl?: string;
  signatureUrl?: string;
}

export function invoiceToDesignableDoc(invoice: Invoice): DesignableDocumentData {
  return {
    kind: "invoice",
    number: invoice.number,
    status: invoice.status,
    issueDate: invoice.issueDate,
    secondDateLabel: "dueDate",
    secondDate: invoice.dueDate,
    currency: invoice.currency,
    lineItems: invoice.lineItems,
    totals: invoice.totals,
    notes: invoice.notes,
    terms: invoice.terms,
    qrCodeUrl: invoice.qrCodeUrl,
    signatureUrl: invoice.signatureUrl,
  };
}

export function quoteToDesignableDoc(quote: Quote): DesignableDocumentData {
  return {
    kind: "quote",
    number: quote.number,
    status: quote.status,
    issueDate: quote.issueDate,
    secondDateLabel: "validUntil",
    secondDate: quote.expiryDate,
    currency: quote.currency,
    lineItems: quote.lineItems,
    totals: quote.totals,
    notes: quote.notes,
    terms: quote.terms,
  };
}

/** A representative sample document — used by the Design Studio live
 * preview and template gallery so every panel updates instantly without
 * needing a real invoice loaded. */
export const SAMPLE_DESIGNABLE_DOC: DesignableDocumentData = {
  kind: "invoice",
  number: "INV-0128",
  status: "pending",
  issueDate: new Date().toISOString(),
  secondDateLabel: "dueDate",
  secondDate: new Date(Date.now() + 14 * 86400000).toISOString(),
  currency: "USD",
  lineItems: [
    { id: "s1", description: "Brand identity package", quantity: 1, unitPrice: 1800 },
    { id: "s2", description: "Monthly retainer — 20h", quantity: 2, unitPrice: 1200 },
    { id: "s3", description: "Website maintenance", quantity: 1, unitPrice: 350 },
  ],
  totals: { subtotal: 4550, discountTotal: 100, taxTotal: 445, total: 4895, amountDue: 4895 },
  notes: "Thank you for the opportunity to work together.",
  terms: "Payment due within 14 days of receipt.",
};
