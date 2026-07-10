"use client";

import { orderBy } from "@/lib/firebase/firestoreService";
import { clientService } from "@/lib/services/clientService";
import { useOrgCollection } from "./useOrgCollection";

export function useClients() {
  return useOrgCollection(clientService, [orderBy("displayName", "asc")]);
}
