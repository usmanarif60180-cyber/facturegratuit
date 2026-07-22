import type { Timestamps } from "./common";

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type TaskRecurringFrequency = "daily" | "weekly" | "monthly";

/** What a task can be linked to — the CRM timeline, invoices/quotes for
 * follow-ups, or nothing (a plain standalone to-do). */
export type TaskRelatedType = "client" | "lead" | "invoice" | "quote";

export interface BusinessTask extends Timestamps {
  id: string;
  organizationId: string;
  title: string;
  notes?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  /** ISO datetime — surfaced by the Notification Center when it's due soon. */
  reminderAt?: string;
  recurring?: TaskRecurringFrequency;
  relatedType?: TaskRelatedType;
  relatedId?: string;
  completedAt?: string;
}
