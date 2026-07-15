"use client";

import * as React from "react";
import { orderBy, where } from "@/lib/firebase/firestoreService";
import { activityLogService } from "@/lib/services/activityLogService";
import type { ActivityEntityType } from "@/types";
import { useOrgCollection } from "./useOrgCollection";

/** The Customer Timeline feed — every logged note/call/meeting/email plus
 * system entries (status changes, ...) for one client or lead. */
export function useEntityActivity(entityType: ActivityEntityType, entityId: string | undefined) {
  const constraints = React.useMemo(
    () => [where("entityType", "==", entityType), where("entityId", "==", entityId ?? "__none__"), orderBy("createdAt", "desc")],
    [entityType, entityId]
  );
  return useOrgCollection(activityLogService, constraints);
}
