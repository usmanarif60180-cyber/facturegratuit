"use client";

import { orderBy } from "@/lib/firebase/firestoreService";
import { notificationService } from "@/lib/services/notificationService";
import { useOrgCollection } from "./useOrgCollection";

export function useNotifications() {
  return useOrgCollection(notificationService, [orderBy("createdAt", "desc")]);
}
