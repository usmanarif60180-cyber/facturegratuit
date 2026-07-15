import { createOrgScopedService } from "@/lib/firebase/firestoreService";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { Lead } from "@/types";

export const leadService = createOrgScopedService<Lead>(COLLECTIONS.leads);
