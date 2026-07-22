"use client";

import * as React from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { useToast } from "@/components/ui/Toast";
import { taskService } from "@/lib/services/taskService";
import type { BusinessTask, TaskPriority, TaskRecurringFrequency } from "@/types";

interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  organizationId: string;
  task?: BusinessTask | null;
}

const PRIORITIES: TaskPriority[] = ["low", "medium", "high"];
const RECURRING: TaskRecurringFrequency[] = ["daily", "weekly", "monthly"];

const EMPTY = { title: "", notes: "", priority: "medium" as TaskPriority, dueDate: "", recurring: "" as TaskRecurringFrequency | "" };

export function TaskFormDialog({ open, onClose, organizationId, task }: TaskFormDialogProps) {
  const { toast } = useToast();
  const [form, setForm] = React.useState(EMPTY);
  const [recurringEnabled, setRecurringEnabled] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        notes: task.notes ?? "",
        priority: task.priority,
        dueDate: task.dueDate?.slice(0, 10) ?? "",
        recurring: task.recurring ?? "",
      });
      setRecurringEnabled(!!task.recurring);
    } else {
      setForm(EMPTY);
      setRecurringEnabled(false);
    }
  }, [task, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        notes: form.notes || undefined,
        priority: form.priority,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
        recurring: recurringEnabled && form.recurring ? form.recurring : undefined,
      };
      if (task) {
        await taskService.update(organizationId, task.id, payload);
        toast({ variant: "success", title: "Task updated" });
      } else {
        await taskService.create(organizationId, { ...payload, status: "todo" });
        toast({ variant: "success", title: "Task added" });
      }
      onClose();
    } catch {
      toast({ variant: "error", title: "Couldn't save task", description: "Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={task ? "Edit task" : "Add task"} className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select id="priority" value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as TaskPriority }))}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="dueDate">Due date</Label>
            <Input id="dueDate" type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
          <p className="text-sm font-medium">Recurring task</p>
          <Switch checked={recurringEnabled} onChange={setRecurringEnabled} aria-label="Recurring task" />
        </div>
        {recurringEnabled && (
          <Select
            value={form.recurring || "daily"}
            onChange={(e) => setForm((f) => ({ ...f, recurring: e.target.value as TaskRecurringFrequency }))}
          >
            {RECURRING.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </Select>
        )}

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" rows={3} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {task ? "Save changes" : "Add task"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
