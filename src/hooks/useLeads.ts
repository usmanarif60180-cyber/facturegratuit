"use client";

import { orderBy } from "@/lib/firebase/firestoreService";
import { leadService } from "@/lib/services/leadService";
import { useOrgCollection } from "./useOrgCollection";

export function useLeads() {
  return useOrgCollection(leadService, [orderBy("createdAt", "desc")]);
}
