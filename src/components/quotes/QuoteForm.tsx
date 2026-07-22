"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { LineItemsEditor } from "@/components/shared/LineItemsEditor";
import { useToast } from "@/components/ui/Toast";
import { useClients } from "@/hooks/useClients";
import { useOrganization } from "@/hooks/useOrganization";
import { CURRENCIES } from "@/lib/constants/currencies";
import { DEFAULT_TAX_RATES } from "@/lib/constants/taxRates";
import { quoteService } from "@/lib/services/quoteService";
import type { CurrencyCode, LineItem } from "@/types";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function plusDaysISO(days: number) {
  return new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
}

export function QuoteForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { items: clients, organizationId } = useClients();
  const { organization } = useOrganization();

  const [clientId, setClientId] = React.useState("");
  const [issueDate, setIssueDate] = React.useState(todayISO());
  const [expiryDate, setExpiryDate] = React.useState(plusDaysISO(30));
  const [currency, setCurrency] = React.useState<CurrencyCode>(
    organization?.settings.defaultCurrency ?? "USD"
  );
  const [lineItems, setLineItems] = React.useState<LineItem[]>([
    { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [notes, setNotes] = React.useState("");
  const [terms, setTerms] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (organization?.settings.defaultCurrency) setCurrency(organization.settings.defaultCurrency);
  }, [organization?.settings.defaultCurrency]);

  async function handleSave(status: "draft" | "sent") {
    if (!organizationId) return;
    if (!clientId) {
      toast({ variant: "error", title: "Select a client first" });
      return;
    }
    setSaving(true);
    try {
      const id = await quoteService.createQuote(organizationId, {
        clientId,
        issueDate: new Date(issueDate).toISOString(),
        expiryDate: new Date(expiryDate).toISOString(),
        currency,
        lineItems,
        notes,
        terms,
        status,
        taxRates: DEFAULT_TAX_RATES,
      });
      toast({ variant: "success", title: "Quote created" });
      router.push(`/quotes/${id}`);
    } catch {
      toast({ variant: "error", title: "Couldn't save quote", description: "Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quote details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Label htmlFor="client">Client</Label>
            <Select id="client" value={clientId} onChange={(e) => setClientId(e.target.value)}>
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.displayName}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="issueDate">Issue date</Label>
            <Input
              id="issueDate"
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="expiryDate">Expiry date</Label>
            <Input
              id="expiryDate"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Line items</CardTitle>
        </CardHeader>
        <CardContent>
          <LineItemsEditor
            lineItems={lineItems}
            onChange={setLineItems}
            taxRates={DEFAULT_TAX_RATES}
            currency={currency}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes &amp; terms</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="terms">Terms</Label>
            <Textarea id="terms" rows={4} value={terms} onChange={(e) => setTerms(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" loading={saving} onClick={() => handleSave("draft")}>
          Save as draft
        </Button>
        <Button loading={saving} onClick={() => handleSave("sent")}>
          Save &amp; mark sent
        </Button>
      </div>
    </div>
  );
}
