"use client";

import * as React from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { leadService } from "@/lib/services/leadService";
import { PIPELINE_STAGES, PIPELINE_STAGE_LABELS } from "@/types/crm";
import type { Lead, PipelineStage } from "@/types";

interface LeadFormDialogProps {
  open: boolean;
  onClose: () => void;
  organizationId: string;
  defaultCurrency: string;
  lead?: Lead | null;
}

const EMPTY = { name: "", companyName: "", email: "", phone: "", source: "", stage: "new" as PipelineStage, estimatedValue: "", notes: "" };

export function LeadFormDialog({ open, onClose, organizationId, defaultCurrency, lead }: LeadFormDialogProps) {
  const { toast } = useToast();
  const [form, setForm] = React.useState(EMPTY);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name,
        companyName: lead.companyName ?? "",
        email: lead.email ?? "",
        phone: lead.phone ?? "",
        source: lead.source ?? "",
        stage: lead.stage,
        estimatedValue: lead.estimatedValue !== undefined ? String(lead.estimatedValue) : "",
        notes: lead.notes ?? "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [lead, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        companyName: form.companyName || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        source: form.source || undefined,
        stage: form.stage,
        estimatedValue: form.estimatedValue ? Number(form.estimatedValue) : undefined,
        currency: defaultCurrency,
        notes: form.notes || undefined,
      };
      if (lead) {
        await leadService.update(organizationId, lead.id, payload);
        toast({ variant: "success", title: "Lead updated" });
      } else {
        await leadService.create(organizationId, payload);
        toast({ variant: "success", title: "Lead added" });
      }
      onClose();
    } catch {
      toast({ variant: "error", title: "Couldn't save lead", description: "Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={lead ? "Edit lead" : "Add lead"} className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="companyName">Company</Label>
            <Input id="companyName" value={form.companyName} onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="source">Source</Label>
            <Input id="source" placeholder="Referral, website…" value={form.source} onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="stage">Stage</Label>
            <Select id="stage" value={form.stage} onChange={(e) => setForm((f) => ({ ...f, stage: e.target.value as PipelineStage }))}>
              {PIPELINE_STAGES.map((s) => (
                <option key={s} value={s}>
                  {PIPELINE_STAGE_LABELS[s]}
                </option>
              ))}
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="estimatedValue">Estimated value ({defaultCurrency})</Label>
            <Input
              id="estimatedValue"
              type="number"
              min={0}
              step="any"
              value={form.estimatedValue}
              onChange={(e) => setForm((f) => ({ ...f, estimatedValue: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" rows={3} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {lead ? "Save changes" : "Add lead"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
