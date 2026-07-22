"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const PREFIXES = ["Nova", "Bright", "Summit", "North", "Blue", "Prime", "Clear", "Bold", "True", "Rising"];
const SUFFIXES = ["Studio", "Collective", "Works", "Co.", "Group", "Partners", "Labs", "House", "Method", "Craft"];

function generate(keyword: string): string[] {
  const clean = keyword.trim().replace(/\s+/g, " ");
  const cap = clean ? clean[0]!.toUpperCase() + clean.slice(1) : "";
  const names = new Set<string>();

  PREFIXES.forEach((p) => {
    if (cap) names.add(`${p} ${cap}`);
  });
  SUFFIXES.forEach((s) => {
    if (cap) names.add(`${cap} ${s}`);
  });
  if (cap) names.add(`${cap} & Co.`);
  if (cap) names.add(`The ${cap} Studio`);

  return Array.from(names).slice(0, 12);
}

export function BusinessNameGenerator() {
  const [keyword, setKeyword] = React.useState("Nova");
  const [seed, setSeed] = React.useState(0);

  const names = React.useMemo(() => {
    const all = generate(keyword);
    // simple deterministic shuffle keyed by seed, so "Shuffle" feels alive without randomness bugs in SSR
    return [...all].sort((a, b) => ((a.length + seed) % 7) - ((b.length + seed) % 7));
  }, [keyword, seed]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="keyword">A word that describes your business</Label>
            <Input id="keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. Harbor, Craft, Atlas" />
          </div>
          <Button variant="outline" onClick={() => setSeed((s) => s + 1)} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Shuffle
          </Button>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          {names.map((name) => (
            <div key={name} className="rounded-md border border-border bg-surface px-3 py-2 text-center text-sm font-medium">
              {name}
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Always check domain and trademark availability before committing to a name.
        </p>
      </CardContent>
    </Card>
  );
}
