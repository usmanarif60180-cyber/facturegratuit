"use client";

import * as React from "react";
import { Paperclip, ScanLine } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { expenseService } from "@/lib/services/expenseService";
import { notificationService } from "@/lib/services/notificationService";
import { uploadOrganizationFile } from "@/lib/firebase/storage";
import { CURRENCIES } from "@/lib/constants/currencies";
import { EXPENSE_CATEGORIES, type RecurringFrequency } from "@/types/expense";
import type { Expense } from "@/types";

interface ExpenseFormDialogProps {
  open: boolean;
  onClose: () => void;
  organizationId: string;
  defaultCurrency: string;
  expense?: Expense | null;
}

const RECURRING_FREQUENCIES: { value: RecurringFrequency; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function ExpenseFormDialog({
  open,
  onClose,
  organizationId,
  defaultCurrency,
  expense,
}: ExpenseFormDialogProps) {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState<string>(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = React.useState(0);
  const [currency, setCurrency] = React.useState(defaultCurrency);
  const [date, setDate] = React.useState(todayISO());
  const [vendor, setVendor] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [receiptUrl, setReceiptUrl] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const [recurringEnabled, setRecurringEnabled] = React.useState(false);
  const [recurringFrequency, setRecurringFrequency] = React.useState<RecurringFrequency>("monthly");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setCategory(expense.category);
      setAmount(expense.amount);
      setCurrency(expense.currency);
      setDate(expense.date.slice(0, 10));
      setVendor(expense.vendor ?? "");
      setNotes(expense.notes ?? "");
      setReceiptUrl(expense.receiptUrl ?? "");
      setRecurringEnabled(!!expense.recurring);
      setRecurringFrequency(expense.recurring?.frequency ?? "monthly");
    } else {
      setTitle("");
      setCategory(EXPENSE_CATEGORIES[0]);
      setAmount(0);
      setCurrency(defaultCurrency);
      setDate(todayISO());
      setVendor("");
      setNotes("");
      setReceiptUrl("");
      setRecurringEnabled(false);
      setRecurringFrequency("monthly");
    }
  }, [expense, open, defaultCurrency]);

  async function handleReceiptChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadOrganizationFile(organizationId, "receipts", file);
      setReceiptUrl(url);
    } catch {
      toast({ variant: "error", title: "Couldn't upload receipt", description: "Please try again." });
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title,
        category,
        amount,
        currency,
        date: new Date(date).toISOString(),
        vendor: vendor || undefined,
        notes: notes || undefined,
        receiptUrl: receiptUrl || undefined,
        recurring: recurringEnabled ? { frequency: recurringFrequency } : undefined,
      };
      if (expense) {
        await expenseService.update(organizationId, expense.id, payload);
        toast({ variant: "success", title: "Expense updated" });
      } else {
        await expenseService.create(organizationId, { ...payload, approvalStatus: "pending" });
        toast({ variant: "success", title: "Expense added" });
        if (profile) {
          notificationService.notify(organizationId, profile.id, {
            type: "expense_added",
            title: "Expense added",
            message: `${title} — ${amount} ${currency}`,
            linkTo: "/expenses",
          });
        }
      }
      onClose();
    } catch {
      toast({ variant: "error", title: "Couldn't save expense", description: "Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={expense ? "Edit expense" : "Add expense"}
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              min={0}
              step="any"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="vendor">Vendor</Label>
            <Input id="vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
          <div>
            <p className="text-sm font-medium">Recurring expense</p>
            <p className="text-xs text-muted-foreground">Repeats automatically for planning and calendar reminders.</p>
          </div>
          <Switch checked={recurringEnabled} onChange={setRecurringEnabled} aria-label="Recurring expense" />
        </div>
        {recurringEnabled && (
          <Select value={recurringFrequency} onChange={(e) => setRecurringFrequency(e.target.value as RecurringFrequency)}>
            {RECURRING_FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </Select>
        )}

        <div>
          <Label htmlFor="receipt">Receipt</Label>
          <div className="flex items-center gap-2">
            <label
              htmlFor="receipt"
              className="flex h-10 flex-1 cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-3 text-sm text-muted-foreground hover:border-foreground/25"
            >
              <Paperclip className="h-4 w-4 shrink-0" />
              {uploading ? "Uploading…" : receiptUrl ? "Receipt attached" : "Upload receipt"}
            </label>
            <input id="receipt" type="file" accept="image/*,application/pdf" className="hidden" onChange={handleReceiptChange} />
            <Badge variant="default" className="shrink-0 gap-1">
              <ScanLine className="h-3 w-3" /> OCR soon
            </Badge>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving || uploading}>
            {expense ? "Save changes" : "Add expense"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
