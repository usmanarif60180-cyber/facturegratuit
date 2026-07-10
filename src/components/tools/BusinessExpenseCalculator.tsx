"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface Row {
  id: string;
  category: string;
  amount: number;
}

const DEFAULT_ROWS: Row[] = [
  { id: "1", category: "Software", amount: 120 },
  { id: "2", category: "Office", amount: 300 },
  { id: "3", category: "Travel", amount: 80 },
];

export function BusinessExpenseCalculator() {
  const [rows, setRows] = React.useState<Row[]>(DEFAULT_ROWS);

  function update(id: string, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function remove(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }
  function add() {
    setRows((prev) => [...prev, { id: crypto.randomUUID(), category: "", amount: 0 }]);
  }

  const total = rows.reduce((s, r) => s + r.amount, 0);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.id} className="flex gap-2">
              <Input
                value={row.category}
                onChange={(e) => update(row.id, { category: e.target.value })}
                placeholder="Category"
                className="flex-1"
              />
              <Input
                type="number"
                min={0}
                step="any"
                value={row.amount}
                onChange={(e) => update(row.id, { amount: Number(e.target.value) })}
                className="w-32"
              />
              <Button variant="ghost" size="icon" aria-label="Remove row" onClick={() => remove(row.id)}>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={add} className="mt-3 gap-2">
          <Plus className="h-4 w-4" /> Add category
        </Button>

        <div className="mt-5 space-y-2 rounded-lg border border-border bg-surface p-4">
          {rows.filter((r) => r.amount > 0).map((row) => {
            const pct = total > 0 ? (row.amount / total) * 100 : 0;
            return (
              <div key={row.id} className="text-sm">
                <div className="flex justify-between">
                  <span>{row.category || "Untitled"}</span>
                  <span className="tabular-nums font-medium">{row.amount.toFixed(2)} ({pct.toFixed(0)}%)</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
          <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
            <span>Total</span>
            <span className="tabular-nums">{total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
