import type { Timestamps } from "./common";

export type NotificationType =
  | "invoice_paid"
  | "invoice_due"
  | "invoice_overdue"
  | "quote_accepted"
  | "quote_declined"
  | "payment_received"
  | "new_customer"
  | "expense_added"
  | "task_reminder"
  | "ai_suggestion"
  | "security_alert"
  | "system";

export interface AppNotification extends Timestamps {
  id: string;
  organizationId: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  linkTo?: string;
}
