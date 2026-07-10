"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";

export function LatePaymentInterestCalculator() {
  const [amount, setAmount] = React.useState(1000);
  const [annualRate, setAnnualRate] = React.useState(8);
  const [daysLate, setDaysLate] = React.useState(30);

  const interest = amount * (annualRate / 100) * (daysLate / 365);
  const total = amount + interest;

  return (
    <Card>
      <CardContent className="grid gap-5 pt-6 sm:grid-cols-3">
        <div>
          <Label htmlFor="amount">Invoice amount</Label>
          <Input id="amount" type="number" min={0} step="any" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="rate">Annual interest rate (%)</Label>
          <Input id="rate" type="number" min={0} step="any" value={annualRate} onChange={(e) => setAnnualRate(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="days">Days overdue</Label>
          <Input id="days" type="number" min={0} value={daysLate} onChange={(e) => setDaysLate(Number(e.target.value))} />
        </div>

        <div className="sm:col-span-3 grid grid-cols-2 gap-3 rounded-lg border border-border bg-surface p-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Interest owed</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-primary">{interest.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total now due</p>
            <p className="mt-1 text-lg font-bold tabular-nums">{total.toFixed(2)}</p>
          </div>
        </div>
        <p className="sm:col-span-3 text-xs text-muted-foreground">
          Simple interest: amount × annual rate × (days late ÷ 365). Check your local late-payment
          legislation — some jurisdictions set a minimum statutory rate.
        </p>
      </CardContent>
    </Card>
  );
}
