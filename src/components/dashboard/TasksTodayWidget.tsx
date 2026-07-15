import Link from "next/link";
import { Circle, ListTodo } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { taskService } from "@/lib/services/taskService";
import type { BusinessTask } from "@/types";

export function TasksTodayWidget({ tasks, organizationId }: { tasks: BusinessTask[]; organizationId?: string }) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const dueTasks = tasks
    .filter((t) => t.status !== "done" && t.dueDate && new Date(t.dueDate) <= today)
    .sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""))
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ListTodo className="h-4 w-4 text-primary" /> Tasks due
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {dueTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing due.{" "}
            <Link href="/tasks" className="text-primary hover:underline">
              View all tasks
            </Link>
            .
          </p>
        ) : (
          dueTasks.map((task) => {
            const overdue = task.dueDate && new Date(task.dueDate) < new Date();
            return (
              <button
                key={task.id}
                type="button"
                disabled={!organizationId}
                onClick={() => organizationId && taskService.setStatus(organizationId, task.id, "done")}
                className="flex w-full items-center gap-2.5 rounded-md px-1.5 py-1 text-left text-sm transition-colors hover:bg-muted"
              >
                <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate">{task.title}</span>
                {overdue && <span className="shrink-0 text-xs font-medium text-danger">Overdue</span>}
              </button>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
