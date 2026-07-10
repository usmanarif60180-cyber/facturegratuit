import { createOrgScopedService } from "@/lib/firebase/firestoreService";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { Product } from "@/types";

export const productService = createOrgScopedService<Product>(COLLECTIONS.products);
