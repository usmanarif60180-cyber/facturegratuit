"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";

export function NumberGenerator({ defaultPrefix }: { defaultPrefix: string }) {
  const [prefix, setPrefix] = React.useState(defaultPrefix);
  const [start, setStart] = React.useState(1);
  const [padding, setPadding] = React.useState(4);
  const [count, setCount] = React.useState(8);

  const preview = Array.from({ length: Math.min(Math.max(count, 1), 50) }, (_, i) =>
    `${prefix}${String(start + i).padStart(padding, "0")}`
  );

  return (
    <Card>
      <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="prefix">Prefix</Label>
          <Input id="prefix" value={prefix} onChange={(e) => setPrefix(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="start">Starting number</Label>
          <Input id="start" type="number" min={0} value={start} onChange={(e) => setStart(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="padding">Digit padding</Label>
          <Input id="padding" type="number" min={1} max={8} value={padding} onChange={(e) => setPadding(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="count">Preview count</Label>
          <Input id="count" type="number" min={1} max={50} value={count} onChange={(e) => setCount(Number(e.target.value))} />
        </div>

        <div className="sm:col-span-2 flex flex-wrap gap-2 rounded-lg border border-border bg-surface p-4">
          {preview.map((n) => (
            <span key={n} className="rounded-md border border-border bg-card px-2.5 py-1 font-mono text-sm tabular-nums">
              {n}
            </span>
          ))}
        </div>
        <p className="sm:col-span-2 text-xs text-muted-foreground">
          IVOXA reserves and increments this number automatically for every document you create — no
          manual tracking needed.
        </p>
      </CardContent>
    </Card>
  );
}
