import type { Timestamps } from "./common";

export type InventoryMovementKind = "restock" | "sale" | "adjustment" | "return";

export interface InventoryMovement extends Timestamps {
  id: string;
  organizationId: string;
  productId: string;
  kind: InventoryMovementKind;
  /** Positive for stock in, negative for stock out. */
  quantityChange: number;
  note?: string;
}
