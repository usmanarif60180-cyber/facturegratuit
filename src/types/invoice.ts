import type { CurrencyCode, DocumentTotals, LineItem, Timestamps } from "./common";

/** "pending" is kept as a synonym for "sent" (awaiting payment) for
 * backward compatibility with records/filters written before payment
 * tracking landed — new code should prefer the more specific statuses. */
export type InvoiceStatus =
  | "draft"
  | "pending"
  | "sent"
  | "viewed"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "canceled"
  | "refunded";

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
  viewedAt?: string;
  paidAt?: string;
  /** Last reminder sent (mailto composer), for "already reminded today" UX. */
  lastReminderAt?: string;
}
