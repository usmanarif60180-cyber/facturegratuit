"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

const TERMS = [
  { label: "Due on receipt", days: 0 },
  { label: "Net 7", days: 7 },
  { label: "Net 14", days: 14 },
  { label: "Net 30", days: 30 },
  { label: "Net 60", days: 60 },
  { label: "Net 90", days: 90 },
  { label: "Custom", days: -1 },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function InvoiceDueDateCalculator() {
  const [issueDate, setIssueDate] = React.useState(todayISO());
  const [term, setTerm] = React.useState("Net 30");
  const [customDays, setCustomDays] = React.useState(30);

  const days = TERMS.find((t) => t.label === term)?.days ?? 30;
  const effectiveDays = days === -1 ? customDays : days;
  const due = new Date(issueDate);
  due.setDate(due.getDate() + effectiveDays);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86400000);

  return (
    <Card>
      <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="issueDate">Issue date</Label>
          <Input id="issueDate" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="term">Payment terms</Label>
          <Select id="term" value={term} onChange={(e) => setTerm(e.target.value)}>
            {TERMS.map((t) => (
              <option key={t.label} value={t.label}>
                {t.label}
              </option>
            ))}
          </Select>
        </div>
        {days === -1 && (
          <div className="sm:col-span-2">
            <Label htmlFor="customDays">Custom number of days</Label>
            <Input id="customDays" type="number" min={0} value={customDays} onChange={(e) => setCustomDays(Number(e.target.value))} />
          </div>
        )}

        <div className="sm:col-span-2 rounded-lg border border-border bg-surface p-4 text-center">
          <p className="text-xs text-muted-foreground">Due date</p>
          <p className="mt-1 text-2xl font-bold">
            {due.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {diffDays > 0 ? `${diffDays} days from today` : diffDays === 0 ? "Due today" : `${Math.abs(diffDays)} days overdue`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
