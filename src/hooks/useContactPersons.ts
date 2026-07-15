"use client";

import { orderBy } from "@/lib/firebase/firestoreService";
import { contactPersonService } from "@/lib/services/contactPersonService";
import { useOrgCollection } from "./useOrgCollection";

export function useContactPersons() {
  return useOrgCollection(contactPersonService, [orderBy("name", "asc")]);
}
