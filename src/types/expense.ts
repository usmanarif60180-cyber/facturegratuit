import type { CurrencyCode, Timestamps } from "./common";

export const EXPENSE_CATEGORIES = [
  "Travel",
  "Fuel",
  "Office",
  "Equipment",
  "Marketing",
  "Software",
  "Salary",
  "Utilities",
  "Maintenance",
  "Tax",
  "Other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export type ExpenseApprovalStatus = "pending" | "approved" | "rejected";

export type RecurringFrequency = "weekly" | "monthly" | "yearly";

export interface RecurringExpenseConfig {
  frequency: RecurringFrequency;
  /** ISO date of the next occurrence — used to surface it on the Calendar. */
  nextDate?: string;
}

export interface Expense extends Timestamps {
  id: string;
  organizationId: string;
  title: string;
  /** Free-text category kept for backward compatibility — new expenses
   * should use one of EXPENSE_CATEGORIES, but existing records aren't
   * migrated or constrained to the list. */
  category: string;
  amount: number;
  currency: CurrencyCode;
  date: string;
  vendor?: string;
  notes?: string;
  receiptUrl?: string;
  /** Set once an OCR provider is connected — the upload flow ships now,
   * scanning does not. */
  ocrProcessed?: boolean;
  billable?: boolean;
  clientId?: string;
  approvalStatus?: ExpenseApprovalStatus;
  recurring?: RecurringExpenseConfig;
}
