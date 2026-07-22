"use client";

import { orderBy } from "@/lib/firebase/firestoreService";
import { paymentService } from "@/lib/services/paymentService";
import { useOrgCollection } from "./useOrgCollection";

export function usePayments() {
  return useOrgCollection(paymentService, [orderBy("date", "desc")]);
}
