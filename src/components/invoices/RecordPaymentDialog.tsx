"use client";

import * as React from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { paymentService } from "@/lib/services/paymentService";
import type { Invoice, PaymentMethod } from "@/types";

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "card", label: "Card" },
  { value: "cash", label: "Cash" },
  { value: "paypal", label: "PayPal" },
  { value: "check", label: "Check" },
  { value: "other", label: "Other" },
];

interface RecordPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  organizationId: string;
  invoice: Invoice;
  onRecorded: () => void;
}

export function RecordPaymentDialog({ open, onClose, organizationId, invoice, onRecorded }: RecordPaymentDialogProps) {
  const { toast } = useToast();
  const outstanding = invoice.totals.amountDue ?? invoice.totals.total - (invoice.totals.amountPaid ?? 0);
  const [amount, setAmount] = React.useState(String(outstanding));
  const [method, setMethod] = React.useState<PaymentMethod>("bank_transfer");
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setAmount(String(outstanding > 0 ? outstanding : invoice.totals.total));
      setMethod("bank_transfer");
      setDate(new Date().toISOString().slice(0, 10));
      setNote("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) return;
    setSaving(true);
    try {
      await paymentService.recordPayment(organizationId, {
        invoiceId: invoice.id,
        clientId: invoice.clientId,
        amount: parsed,
        currency: invoice.currency,
        method,
        date,
        note: note || undefined,
      });
      toast({ variant: "success", title: "Payment recorded" });
      onRecorded();
      onClose();
    } catch {
      toast({ variant: "error", title: "Couldn't record payment", description: "Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title="Record payment" description={`Against ${invoice.number}`}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="method">Method</Label>
            <Select id="method" value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="note">Note</Label>
          <Textarea id="note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Record payment
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
