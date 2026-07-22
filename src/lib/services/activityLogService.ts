import { createOrgScopedService } from "@/lib/firebase/firestoreService";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { ActivityLog } from "@/types";

export const activityLogService = createOrgScopedService<ActivityLog>(COLLECTIONS.activityLogs);
