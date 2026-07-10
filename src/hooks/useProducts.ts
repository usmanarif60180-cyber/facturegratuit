"use client";

import { orderBy } from "@/lib/firebase/firestoreService";
import { productService } from "@/lib/services/productService";
import { useOrgCollection } from "./useOrgCollection";

export function useProducts() {
  return useOrgCollection(productService, [orderBy("name", "asc")]);
}
