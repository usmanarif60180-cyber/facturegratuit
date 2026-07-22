"use client";

import { orderBy } from "@/lib/firebase/firestoreService";
import { companyService } from "@/lib/services/companyService";
import { useOrgCollection } from "./useOrgCollection";

export function useCompanies() {
  return useOrgCollection(companyService, [orderBy("name", "asc")]);
}
