"use client";

import * as React from "react";
import { ArrowLeftRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { CURRENCIES } from "@/lib/constants/currencies";

export function CurrencyConverter() {
  const [amount, setAmount] = React.useState(100);
  const [from, setFrom] = React.useState("USD");
  const [to, setTo] = React.useState("EUR");
  const [rate, setRate] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [asOf, setAsOf] = React.useState<string | null>(null);

  const fetchRate = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      const nextRate = data?.rates?.[to];
      if (typeof nextRate !== "number") throw new Error("Rate unavailable");
      setRate(nextRate);
      setAsOf(data.date ?? null);
    } catch {
      setError("Live rates are unavailable right now. Enter a rate manually below.");
      setRate(null);
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  React.useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  return (
    <Card>
      <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" min={0} step="any" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label htmlFor="from">From</Label>
            <Select id="from" value={from} onChange={(e) => setFrom(e.target.value)}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.code}</option>
              ))}
            </Select>
          </div>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            aria-label="Swap currencies"
            onClick={() => { setFrom(to); setTo(from); }}
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <Label htmlFor="to">To</Label>
            <Select id="to" value={to} onChange={(e) => setTo(e.target.value)}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.code}</option>
              ))}
            </Select>
          </div>
        </div>

        <div className="sm:col-span-2 rounded-lg border border-border bg-surface p-4 text-center">
          {loading ? (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Fetching rate…
            </div>
          ) : error || rate === null ? (
            <div className="space-y-2">
              <p className="text-sm text-warning">{error}</p>
              <Input
                type="number"
                min={0}
                step="any"
                placeholder={`1 ${from} = ? ${to}`}
                onChange={(e) => setRate(Number(e.target.value) || null)}
                className="mx-auto max-w-xs"
              />
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold tabular-nums">
                {(amount * rate).toLocaleString(undefined, { maximumFractionDigits: 2 })} {to}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                1 {from} = {rate.toFixed(4)} {to} {asOf && `· as of ${asOf}`}
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
