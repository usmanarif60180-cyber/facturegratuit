import { createOrgScopedService } from "@/lib/firebase/firestoreService";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { Client } from "@/types";

export const clientService = createOrgScopedService<Client>(COLLECTIONS.clients);
