"use client";

import * as React from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { expenseService } from "@/lib/services/expenseService";
import { CURRENCIES } from "@/lib/constants/currencies";
import type { Expense } from "@/types";

interface ExpenseFormDialogProps {
  open: boolean;
  onClose: () => void;
  organizationId: string;
  defaultCurrency: string;
  expense?: Expense | null;
}

const CATEGORIES = ["Software", "Travel", "Office", "Marketing", "Professional services", "Other"];

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
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState(CATEGORIES[0]!);
  const [amount, setAmount] = React.useState(0);
  const [currency, setCurrency] = React.useState(defaultCurrency);
  const [date, setDate] = React.useState(todayISO());
  const [vendor, setVendor] = React.useState("");
  const [notes, setNotes] = React.useState("");
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
    } else {
      setTitle("");
      setCategory(CATEGORIES[0]!);
      setAmount(0);
      setCurrency(defaultCurrency);
      setDate(todayISO());
      setVendor("");
      setNotes("");
    }
  }, [expense, open, defaultCurrency]);

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
      };
      if (expense) {
        await expenseService.update(organizationId, expense.id, payload);
        toast({ variant: "success", title: "Expense updated" });
      } else {
        await expenseService.create(organizationId, payload);
        toast({ variant: "success", title: "Expense added" });
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
              {CATEGORIES.map((c) => (
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
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {expense ? "Save changes" : "Add expense"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
