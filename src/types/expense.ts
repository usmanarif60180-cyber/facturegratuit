import type { CurrencyCode, Timestamps } from "./common";

export interface Expense extends Timestamps {
  id: string;
  organizationId: string;
  title: string;
  category: string;
  amount: number;
  currency: CurrencyCode;
  date: string;
  vendor?: string;
  notes?: string;
  receiptUrl?: string;
  billable?: boolean;
  clientId?: string;
}
