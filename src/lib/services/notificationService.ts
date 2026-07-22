import { createOrgScopedService } from "@/lib/firebase/firestoreService";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { AppNotification, NotificationType } from "@/types";

const base = createOrgScopedService<AppNotification>(COLLECTIONS.notifications);

async function markRead(organizationId: string, id: string) {
  await base.update(organizationId, id, { read: true });
}

async function markAllRead(organizationId: string, notifications: AppNotification[]) {
  await Promise.all(
    notifications.filter((n) => !n.read).map((n) => base.update(organizationId, n.id, { read: true }))
  );
}

/**
 * Fire-and-forget notification creation for use as a side effect of other
 * actions (invoice paid, quote accepted, ...). Never throws — a failed
 * notification write must never break the action that triggered it.
 */
async function notify(
  organizationId: string,
  userId: string,
  input: { type: NotificationType; title: string; message: string; linkTo?: string }
) {
  try {
    await base.create(organizationId, { userId, read: false, ...input });
  } catch {
    // best-effort — the triggering action already succeeded.
  }
}

export const notificationService = { ...base, markRead, markAllRead, notify };
