import { createOrgScopedService } from "@/lib/firebase/firestoreService";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { BusinessTask, TaskStatus } from "@/types";

const base = createOrgScopedService<BusinessTask>(COLLECTIONS.tasks);

async function setStatus(organizationId: string, taskId: string, status: TaskStatus) {
  const extra = status === "done" ? { completedAt: new Date().toISOString() } : {};
  await base.update(organizationId, taskId, { status, ...extra });
}

export const taskService = { ...base, setStatus };
