import type { CurrencyCode, DocumentTotals, LineItem, Timestamps } from "./common";

export type QuoteStatus = "draft" | "sent" | "accepted" | "declined" | "expired" | "converted";

export interface Quote extends Timestamps {
  id: string;
  organizationId: string;
  clientId: string;
  number: string;
  status: QuoteStatus;
  issueDate: string;
  expiryDate: string;
  currency: CurrencyCode;
  lineItems: LineItem[];
  totals: DocumentTotals;
  notes?: string;
  terms?: string;
  convertedInvoiceId?: string;
  pdfUrl?: string;
  sentAt?: string;
}
