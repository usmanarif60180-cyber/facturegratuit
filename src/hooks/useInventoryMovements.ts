"use client";

import { orderBy } from "@/lib/firebase/firestoreService";
import { inventoryMovementService } from "@/lib/services/inventoryMovementService";
import { useOrgCollection } from "./useOrgCollection";

export function useInventoryMovements() {
  return useOrgCollection(inventoryMovementService, [orderBy("createdAt", "desc")]);
}
