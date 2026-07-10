"use client";

import { orderBy } from "@/lib/firebase/firestoreService";
import { invoiceService } from "@/lib/services/invoiceService";
import { useOrgCollection } from "./useOrgCollection";

export function useInvoices() {
  return useOrgCollection(invoiceService, [orderBy("createdAt", "desc")]);
}
