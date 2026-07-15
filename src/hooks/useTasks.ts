"use client";

import { orderBy } from "@/lib/firebase/firestoreService";
import { taskService } from "@/lib/services/taskService";
import { useOrgCollection } from "./useOrgCollection";

export function useTasks() {
  return useOrgCollection(taskService, [orderBy("createdAt", "desc")]);
}
