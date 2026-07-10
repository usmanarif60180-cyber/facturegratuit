"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";

export function ProfitMarginCalculator() {
  const [cost, setCost] = React.useState(60);
  const [price, setPrice] = React.useState(100);

  const profit = price - cost;
  const margin = price > 0 ? (profit / price) * 100 : 0;
  const markup = cost > 0 ? (profit / cost) * 100 : 0;

  return (
    <Card>
      <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="cost">Cost price</Label>
          <Input id="cost" type="number" min={0} step="any" value={cost} onChange={(e) => setCost(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="price">Selling price</Label>
          <Input id="price" type="number" min={0} step="any" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        </div>

        <div className="sm:col-span-2 grid grid-cols-3 gap-3 rounded-lg border border-border bg-surface p-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Profit</p>
            <p className="mt-1 text-lg font-bold tabular-nums">{profit.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Margin</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-primary">{margin.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Markup</p>
            <p className="mt-1 text-lg font-bold tabular-nums">{markup.toFixed(1)}%</p>
          </div>
        </div>
        <p className="sm:col-span-2 text-xs text-muted-foreground">
          Margin is profit as a percentage of selling price. Markup is profit as a percentage of cost.
        </p>
      </CardContent>
    </Card>
  );
}
