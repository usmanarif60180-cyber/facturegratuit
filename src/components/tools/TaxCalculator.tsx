"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export function TaxCalculator() {
  const [amount, setAmount] = React.useState(100);
  const [rate, setRate] = React.useState(20);
  const [mode, setMode] = React.useState<"add" | "extract">("add");

  const tax = mode === "add" ? amount * (rate / 100) : amount - amount / (1 + rate / 100);
  const net = mode === "add" ? amount : amount - tax;
  const total = mode === "add" ? amount + tax : amount;

  return (
    <Card>
      <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="mode">Calculation</Label>
          <Select id="mode" value={mode} onChange={(e) => setMode(e.target.value as "add" | "extract")}>
            <option value="add">Add tax to a net amount</option>
            <option value="extract">Extract tax from a total (tax-inclusive)</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="rate">Tax rate (%)</Label>
          <Input id="rate" type="number" min={0} step="any" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="amount">{mode === "add" ? "Net amount (before tax)" : "Total amount (tax-inclusive)"}</Label>
          <Input id="amount" type="number" min={0} step="any" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        </div>

        <div className="sm:col-span-2 grid grid-cols-3 gap-3 rounded-lg border border-border bg-surface p-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Net</p>
            <p className="mt-1 text-lg font-bold tabular-nums">{net.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Tax</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-primary">{tax.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="mt-1 text-lg font-bold tabular-nums">{total.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
