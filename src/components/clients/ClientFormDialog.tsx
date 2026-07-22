"use client";

import * as React from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { clientService } from "@/lib/services/clientService";
import { notificationService } from "@/lib/services/notificationService";
import { COUNTRIES } from "@/lib/constants/countries";
import type { Client } from "@/types";

interface ClientFormDialogProps {
  open: boolean;
  onClose: () => void;
  organizationId: string;
  client?: Client | null;
}

const EMPTY = {
  displayName: "",
  companyName: "",
  email: "",
  phone: "",
  countryCode: "",
  city: "",
  vatNumber: "",
  companyNumber: "",
  notes: "",
};

export function ClientFormDialog({ open, onClose, organizationId, client }: ClientFormDialogProps) {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [form, setForm] = React.useState(EMPTY);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (client) {
      setForm({
        displayName: client.displayName,
        companyName: client.companyName ?? "",
        email: client.email ?? "",
        phone: client.phone ?? "",
        countryCode: client.address?.countryCode ?? "",
        city: client.address?.city ?? "",
        vatNumber: client.vatNumber ?? "",
        companyNumber: client.companyNumber ?? "",
        notes: client.notes ?? "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [client, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        displayName: form.displayName,
        companyName: form.companyName || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        address: { countryCode: form.countryCode || undefined, city: form.city || undefined },
        vatNumber: form.vatNumber || undefined,
        companyNumber: form.companyNumber || undefined,
        notes: form.notes || undefined,
      };
      if (client) {
        await clientService.update(organizationId, client.id, payload);
        toast({ variant: "success", title: "Client updated" });
      } else {
        await clientService.create(organizationId, payload);
        toast({ variant: "success", title: "Client added" });
        if (profile) {
          notificationService.notify(organizationId, profile.id, {
            type: "new_customer",
            title: "New customer",
            message: `${form.displayName} was added.`,
            linkTo: "/clients",
          });
        }
      }
      onClose();
    } catch {
      toast({ variant: "error", title: "Couldn't save client", description: "Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={client ? "Edit client" : "Add client"}
      className="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="displayName">Name</Label>
            <Input
              id="displayName"
              required
              value={form.displayName}
              onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="companyName">Company</Label>
            <Input
              id="companyName"
              value={form.companyName}
              onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Select
              id="country"
              value={form.countryCode}
              onChange={(e) => setForm((f) => ({ ...f, countryCode: e.target.value }))}
            >
              <option value="">Select country</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="vatNumber">VAT number</Label>
            <Input
              id="vatNumber"
              value={form.vatNumber}
              onChange={(e) => setForm((f) => ({ ...f, vatNumber: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="companyNumber">Company number</Label>
            <Input
              id="companyNumber"
              value={form.companyNumber}
              onChange={(e) => setForm((f) => ({ ...f, companyNumber: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            rows={3}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {client ? "Save changes" : "Add client"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
