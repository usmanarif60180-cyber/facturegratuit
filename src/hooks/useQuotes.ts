"use client";

import { orderBy } from "@/lib/firebase/firestoreService";
import { quoteService } from "@/lib/services/quoteService";
import { useOrgCollection } from "./useOrgCollection";

export function useQuotes() {
  return useOrgCollection(quoteService, [orderBy("createdAt", "desc")]);
}
