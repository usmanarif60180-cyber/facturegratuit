import type { Timestamps } from "./common";

export type ActivityEntityType =
  | "invoice"
  | "quote"
  | "client"
  | "product"
  | "expense"
  | "organization"
  | "lead"
  | "task"
  | "payment";

/** Doubles as the CRM "Customer Timeline" feed when entityType is
 * "client" or "lead" — note/call/meeting/email log entries reuse `action`
 * for the activity kind and `description` for the free-text body. */
export type ActivityKind = "note" | "call" | "meeting" | "email" | "status_change" | "system";

export interface ActivityLog extends Timestamps {
  id: string;
  organizationId: string;
  userId: string;
  entityType: ActivityEntityType;
  entityId: string;
  action: string; // e.g. "created", "updated", "sent", "marked_paid", or an ActivityKind
  description: string;
  kind?: ActivityKind;
}
