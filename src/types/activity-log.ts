import type { Timestamps } from "./common";

export type ActivityEntityType = "invoice" | "quote" | "client" | "product" | "expense" | "organization";

export interface ActivityLog extends Timestamps {
  id: string;
  organizationId: string;
  userId: string;
  entityType: ActivityEntityType;
  entityId: string;
  action: string; // e.g. "created", "updated", "sent", "marked_paid"
  description: string;
}
