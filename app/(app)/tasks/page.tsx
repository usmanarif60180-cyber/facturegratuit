"use client";

import * as React from "react";
import { m } from "framer-motion";
import { CheckCircle2, Circle, ListTodo, MoreHorizontal, Plus, Repeat } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@/components/ui/Dropdown";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { useTasks } from "@/hooks/useTasks";
import { taskService } from "@/lib/services/taskService";
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog";
import { formatDate } from "@/lib/utils/format";
import type { BusinessTask, TaskPriority, TaskStatus } from "@/types";

const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
];

const PRIORITY_VARIANTS: Record<TaskPriority, BadgeProps["variant"]> = {
  low: "default",
  medium: "warning",
  high: "danger",
};

export default function TasksPage() {
  const { items: tasks, loading, organizationId } = useTasks();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<BusinessTask | null>(null);

  const byStatus = React.useMemo(() => {
    const map = new Map<TaskStatus, BusinessTask[]>();
    for (const s of STATUSES) map.set(s.value, []);
    for (const task of tasks) map.get(task.status)?.push(task);
    return map;
  }, [tasks]);

  async function setStatus(task: BusinessTask, status: TaskStatus) {
    if (!organizationId) return;
    await taskService.setStatus(organizationId, task.id, status);
  }

  async function handleDelete(task: BusinessTask) {
    if (!organizationId) return;
    await taskService.remove(organizationId, task.id);
    toast({ variant: "success", title: "Task removed" });
  }

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Follow-ups and to-dos across your business."
        action={
          <Button
            className="gap-2"
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add task
          </Button>
        }
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={<ListTodo className="h-6 w-6" />}
          title="No tasks yet"
          description="Add follow-ups, reminders and to-dos to keep on top of your business."
          action={<Button onClick={() => setDialogOpen(true)}>Add task</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {STATUSES.map((statusCol) => {
            const colTasks = byStatus.get(statusCol.value) ?? [];
            return (
              <div key={statusCol.value}>
                <div className="mb-2.5 flex items-center justify-between px-1">
                  <h3 className="text-sm font-semibold">{statusCol.label}</h3>
                  <span className="text-xs text-muted-foreground">{colTasks.length}</span>
                </div>
                <div className="space-y-2.5">
                  {colTasks.map((task) => {
                    const overdue = task.status !== "done" && task.dueDate && new Date(task.dueDate) < new Date();
                    return (
                      <m.div key={task.id} layout transition={{ type: "spring", stiffness: 400, damping: 34 }}>
                        <Card className="p-3.5">
                          <div className="flex items-start gap-2.5">
                            <button
                              type="button"
                              onClick={() => setStatus(task, task.status === "done" ? "todo" : "done")}
                              aria-label={task.status === "done" ? "Mark as not done" : "Mark as done"}
                              className="mt-0.5 shrink-0 text-muted-foreground transition-colors hover:text-primary"
                            >
                              {task.status === "done" ? (
                                <CheckCircle2 className="h-4 w-4 text-success" />
                              ) : (
                                <Circle className="h-4 w-4" />
                              )}
                            </button>
                            <div className="min-w-0 flex-1">
                              <p className={task.status === "done" ? "text-sm text-muted-foreground line-through" : "text-sm font-medium"}>
                                {task.title}
                                {task.recurring && <Repeat className="ml-1.5 inline h-3 w-3 text-muted-foreground" />}
                              </p>
                              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                <Badge variant={PRIORITY_VARIANTS[task.priority]}>{task.priority}</Badge>
                                {task.dueDate && (
                                  <Badge variant={overdue ? "danger" : "default"}>{formatDate(task.dueDate)}</Badge>
                                )}
                              </div>
                            </div>
                            <Dropdown>
                              <DropdownTrigger>
                                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label="Task actions">
                                  <MoreHorizontal className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownTrigger>
                              <DropdownMenu>
                                {STATUSES.filter((s) => s.value !== task.status).map((s) => (
                                  <DropdownItem key={s.value} onSelect={() => setStatus(task, s.value)}>
                                    Move to {s.label}
                                  </DropdownItem>
                                ))}
                                <DropdownItem
                                  onSelect={() => {
                                    setEditing(task);
                                    setDialogOpen(true);
                                  }}
                                >
                                  Edit
                                </DropdownItem>
                                <DropdownItem onSelect={() => handleDelete(task)} className="text-danger">
                                  Delete
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        </Card>
                      </m.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {organizationId && (
        <TaskFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} organizationId={organizationId} task={editing} />
      )}
    </div>
  );
}
