"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { calculateTotals } from "@/lib/utils/totals";
import { formatCurrency } from "@/lib/utils/format";
import type { CurrencyCode, LineItem, TaxRate } from "@/types";

interface LineItemsEditorProps {
  lineItems: LineItem[];
  onChange: (lineItems: LineItem[]) => void;
  taxRates: TaxRate[];
  currency: CurrencyCode;
}

function emptyLineItem(): LineItem {
  return { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0 };
}

export function LineItemsEditor({ lineItems, onChange, taxRates, currency }: LineItemsEditorProps) {
  function updateItem(id: string, patch: Partial<LineItem>) {
    onChange(lineItems.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function removeItem(id: string) {
    onChange(lineItems.filter((item) => item.id !== id));
  }

  function addItem() {
    onChange([...lineItems, emptyLineItem()]);
  }

  const totals = calculateTotals(lineItems, taxRates);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left">Description</th>
              <th className="w-20 px-3 py-2 text-left">Qty</th>
              <th className="w-28 px-3 py-2 text-left">Unit price</th>
              <th className="w-32 px-3 py-2 text-left">Tax</th>
              <th className="w-24 px-3 py-2 text-right">Amount</th>
              <th className="w-10 px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {lineItems.map((item) => {
              const amount = item.quantity * item.unitPrice;
              return (
                <tr key={item.id}>
                  <td className="px-3 py-2">
                    <Input
                      aria-label="Line item description"
                      value={item.description}
                      placeholder="Item or service description"
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      aria-label="Quantity"
                      type="number"
                      min={0}
                      step="any"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      aria-label="Unit price"
                      type="number"
                      min={0}
                      step="any"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) })}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Select
                      aria-label="Tax rate"
                      value={item.taxRateId ?? ""}
                      onChange={(e) => updateItem(item.id, { taxRateId: e.target.value || undefined })}
                    >
                      <option value="">No tax</option>
                      {taxRates.map((rate) => (
                        <option key={rate.id} value={rate.id}>
                          {rate.label}
                        </option>
                      ))}
                    </Select>
                  </td>
                  <td className="px-3 py-2 text-right font-medium">
                    {formatCurrency(amount, currency)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Remove line item"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Button variant="outline" size="sm" onClick={addItem} className="gap-2">
        <Plus className="h-4 w-4" /> Add line item
      </Button>

      <div className="ml-auto flex w-full max-w-xs flex-col gap-1.5 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatCurrency(totals.subtotal, currency)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Discount</span>
          <span>-{formatCurrency(totals.discountTotal, currency)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Tax</span>
          <span>{formatCurrency(totals.taxTotal, currency)}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-1.5 text-base font-semibold">
          <span>Total</span>
          <span>{formatCurrency(totals.total, currency)}</span>
        </div>
      </div>
    </div>
  );
}
