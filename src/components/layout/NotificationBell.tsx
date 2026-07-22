"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { Bell, CheckCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useTasks } from "@/hooks/useTasks";
import { notificationService } from "@/lib/services/notificationService";
import { formatDate } from "@/lib/utils/format";
import type { AppNotification } from "@/types";

/** Computed, non-persisted reminders (task due within 24h) merged into
 * the feed alongside real notifications — avoids write-spam from
 * re-deriving the same reminder on every page load. */
function useEphemeralReminders(): AppNotification[] {
  const { items: tasks } = useTasks();
  return React.useMemo(() => {
    const now = new Date();
    const soon = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return tasks
      .filter((t) => t.status !== "done" && t.dueDate && new Date(t.dueDate) <= soon && new Date(t.dueDate) >= now)
      .map((t) => ({
        id: `task-${t.id}`,
        organizationId: t.organizationId,
        userId: "",
        type: "task_reminder" as const,
        title: "Task due soon",
        message: t.title,
        read: false,
        linkTo: "/tasks",
        createdAt: t.dueDate!,
        updatedAt: t.dueDate!,
      }));
  }, [tasks]);
}

export function NotificationBell() {
  const { profile } = useAuth();
  const { items: notifications, organizationId } = useNotifications();
  const reminders = useEphemeralReminders();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const all = React.useMemo(
    () => [...notifications, ...reminders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 20),
    [notifications, reminders]
  );
  const unreadCount = all.filter((n) => !n.read).length;

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function handleMarkAllRead() {
    if (!organizationId) return;
    await notificationService.markAllRead(organizationId, notifications);
  }

  async function handleItemClick(n: AppNotification) {
    if (organizationId && !n.id.startsWith("task-") && !n.read) {
      notificationService.markRead(organizationId, n.id);
    }
    setOpen(false);
  }

  if (!profile) return null;

  return (
    <div ref={ref} className="relative">
      <Button variant="ghost" size="icon" aria-label="Notifications" onClick={() => setOpen((v) => !v)} className="relative">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-danger-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="glass absolute right-0 z-40 mt-2 max-h-96 w-80 origin-top-right overflow-y-auto rounded-md p-1"
          >
            <div className="flex items-center justify-between px-2.5 py-2">
              <p className="text-sm font-semibold">Notifications</p>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <CheckCheck className="h-3 w-3" /> Mark all read
                </button>
              )}
            </div>
            {all.length === 0 ? (
              <p className="px-2.5 py-6 text-center text-sm text-muted-foreground">You&apos;re all caught up.</p>
            ) : (
              all.map((n) => {
                const content = (
                  <div
                    className={cn(
                      "flex items-start gap-2 rounded-sm px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted",
                      !n.read && "bg-primary/5"
                    )}
                  >
                    {n.type === "ai_suggestion" && <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{n.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{n.message}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground/70">{formatDate(n.createdAt)}</p>
                    </div>
                    {!n.read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                  </div>
                );
                return n.linkTo ? (
                  <Link key={n.id} href={n.linkTo} onClick={() => handleItemClick(n)} className="block">
                    {content}
                  </Link>
                ) : (
                  <button key={n.id} type="button" onClick={() => handleItemClick(n)} className="block w-full">
                    {content}
                  </button>
                );
              })
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
