import type { CurrencyCode, DocumentTotals, LineItem, Timestamps } from "./common";

export type InvoiceStatus = "draft" | "pending" | "paid" | "overdue" | "canceled";

export interface Invoice extends Timestamps {
  id: string;
  organizationId: string;
  clientId: string;
  number: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  currency: CurrencyCode;
  lineItems: LineItem[];
  totals: DocumentTotals;
  notes?: string;
  terms?: string;
  quoteId?: string; // set when converted from a quote
  qrCodeUrl?: string;
  signatureUrl?: string;
  pdfUrl?: string;
  sentAt?: string;
  paidAt?: string;
}
