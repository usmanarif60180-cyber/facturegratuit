"use client";

import * as React from "react";
import { CalendarClock, Mail, MessageSquare, Phone, Plus, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Label, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { useEntityActivity } from "@/hooks/useEntityActivity";
import { activityLogService } from "@/lib/services/activityLogService";
import { formatDate } from "@/lib/utils/format";
import type { ActivityEntityType, ActivityKind } from "@/types";

const KIND_ICON: Record<ActivityKind, React.ComponentType<{ className?: string }>> = {
  note: MessageSquare,
  call: Phone,
  meeting: Users,
  email: Mail,
  status_change: CalendarClock,
  system: CalendarClock,
};

const KIND_LABELS: Record<ActivityKind, string> = {
  note: "Note",
  call: "Call",
  meeting: "Meeting",
  email: "Email",
  status_change: "Status change",
  system: "System",
};

interface CustomerTimelineProps {
  entityType: ActivityEntityType;
  entityId: string;
  organizationId: string;
}

export function CustomerTimeline({ entityType, entityId, organizationId }: CustomerTimelineProps) {
  const { items: activity, loading } = useEntityActivity(entityType, entityId);
  const { profile } = useAuth();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [kind, setKind] = React.useState<ActivityKind>("note");
  const [description, setDescription] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  async function handleLog(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !description.trim()) return;
    setSaving(true);
    try {
      await activityLogService.create(organizationId, {
        userId: profile.id,
        entityType,
        entityId,
        action: kind,
        kind,
        description,
      });
      setDescription("");
      setDialogOpen(false);
      toast({ variant: "success", title: "Activity logged" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Timeline</CardTitle>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setDialogOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> Log activity
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : activity.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity logged yet — notes, calls and meetings will appear here.</p>
        ) : (
          <ul className="space-y-4">
            {activity.map((entry) => {
              const entryKind = entry.kind ?? "system";
              const Icon = KIND_ICON[entryKind];
              return (
                <li key={entry.id} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1 border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{KIND_LABELS[entryKind]}</p>
                      <p className="shrink-0 text-xs text-muted-foreground">{formatDate(entry.createdAt)}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{entry.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Log activity">
        <form onSubmit={handleLog} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="kind">Type</Label>
            <Select id="kind" value={kind} onChange={(e) => setKind(e.target.value as ActivityKind)}>
              <option value="note">Note</option>
              <option value="call">Call</option>
              <option value="meeting">Meeting</option>
              <option value="email">Email</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Details</Label>
            <Textarea id="description" rows={4} required value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Log activity
            </Button>
          </div>
        </form>
      </Dialog>
    </Card>
  );
}
