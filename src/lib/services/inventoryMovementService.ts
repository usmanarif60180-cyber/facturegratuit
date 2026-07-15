import { createOrgScopedService } from "@/lib/firebase/firestoreService";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { productService } from "@/lib/services/productService";
import type { InventoryMovement, InventoryMovementKind } from "@/types";

const base = createOrgScopedService<InventoryMovement>(COLLECTIONS.inventoryMovements);

/** Logs a stock movement and applies the delta to the product's stockQuantity. */
async function recordMovement(
  organizationId: string,
  input: { productId: string; kind: InventoryMovementKind; quantityChange: number; note?: string }
) {
  const movementId = await base.create(organizationId, input);

  const product = await productService.get(organizationId, input.productId);
  if (product) {
    const current = product.stockQuantity ?? 0;
    await productService.update(organizationId, product.id, {
      stockQuantity: current + input.quantityChange,
    });
  }

  return movementId;
}

export const inventoryMovementService = { ...base, recordMovement };
