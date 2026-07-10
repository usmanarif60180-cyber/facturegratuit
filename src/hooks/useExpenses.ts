"use client";

import { orderBy } from "@/lib/firebase/firestoreService";
import { expenseService } from "@/lib/services/expenseService";
import { useOrgCollection } from "./useOrgCollection";

export function useExpenses() {
  return useOrgCollection(expenseService, [orderBy("date", "desc")]);
}
