"use client";

import * as React from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { companyService } from "@/lib/services/companyService";
import { COUNTRIES } from "@/lib/constants/countries";
import type { Company } from "@/types";

interface CompanyFormDialogProps {
  open: boolean;
  onClose: () => void;
  organizationId: string;
  company?: Company | null;
}

const EMPTY = { name: "", industry: "", website: "", size: "", countryCode: "", city: "", notes: "" };

export function CompanyFormDialog({ open, onClose, organizationId, company }: CompanyFormDialogProps) {
  const { toast } = useToast();
  const [form, setForm] = React.useState(EMPTY);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (company) {
      setForm({
        name: company.name,
        industry: company.industry ?? "",
        website: company.website ?? "",
        size: company.size ?? "",
        countryCode: company.address?.countryCode ?? "",
        city: company.address?.city ?? "",
        notes: company.notes ?? "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [company, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        industry: form.industry || undefined,
        website: form.website || undefined,
        size: form.size || undefined,
        address: { countryCode: form.countryCode || undefined, city: form.city || undefined },
        notes: form.notes || undefined,
      };
      if (company) {
        await companyService.update(organizationId, company.id, payload);
        toast({ variant: "success", title: "Company updated" });
      } else {
        await companyService.create(organizationId, payload);
        toast({ variant: "success", title: "Company added" });
      }
      onClose();
    } catch {
      toast({ variant: "error", title: "Couldn't save company", description: "Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={company ? "Edit company" : "Add company"} className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="size">Company size</Label>
            <Input id="size" placeholder="1-10, 11-50…" value={form.size} onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Select id="country" value={form.countryCode} onChange={(e) => setForm((f) => ({ ...f, countryCode: e.target.value }))}>
              <option value="">Select country</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
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
            {company ? "Save changes" : "Add company"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
