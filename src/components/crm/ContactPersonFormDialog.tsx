"use client";

import * as React from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { contactPersonService } from "@/lib/services/contactPersonService";
import type { ContactPerson } from "@/types";

interface ContactPersonFormDialogProps {
  open: boolean;
  onClose: () => void;
  organizationId: string;
  clientId: string;
  contact?: ContactPerson | null;
}

const EMPTY = { name: "", role: "", email: "", phone: "" };

export function ContactPersonFormDialog({ open, onClose, organizationId, clientId, contact }: ContactPersonFormDialogProps) {
  const { toast } = useToast();
  const [form, setForm] = React.useState(EMPTY);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (contact) {
      setForm({ name: contact.name, role: contact.role ?? "", email: contact.email ?? "", phone: contact.phone ?? "" });
    } else {
      setForm(EMPTY);
    }
  }, [contact, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { clientId, name: form.name, role: form.role || undefined, email: form.email || undefined, phone: form.phone || undefined };
      if (contact) {
        await contactPersonService.update(organizationId, contact.id, payload);
        toast({ variant: "success", title: "Contact updated" });
      } else {
        await contactPersonService.create(organizationId, payload);
        toast({ variant: "success", title: "Contact added" });
      }
      onClose();
    } catch {
      toast({ variant: "error", title: "Couldn't save contact", description: "Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={contact ? "Edit contact" : "Add contact"}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {contact ? "Save changes" : "Add contact"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
