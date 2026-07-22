import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Client, Invoice } from "@/types";

interface AiCustomerSummaryProps {
  client: Client;
  invoices: Invoice[];
  currency: string;
}

/** Same honest, deterministic pattern as AiInsightsCard — a computed
 * summary of this one customer's real data, not a model call. */
export function AiCustomerSummary({ client, invoices, currency }: AiCustomerSummaryProps) {
  const paid = invoices.filter((i) => i.status === "paid");
  const lifetimeValue = paid.reduce((sum, i) => sum + i.totals.total, 0);
  const overdue = invoices.filter((i) => i.status === "overdue");
  const lastInvoice = [...invoices].sort((a, b) => b.issueDate.localeCompare(a.issueDate))[0];

  const lines: string[] = [];
  lines.push(
    lifetimeValue > 0
      ? `${client.displayName} has generated ${formatCurrency(lifetimeValue, currency)} across ${paid.length} paid invoice${paid.length === 1 ? "" : "s"}.`
      : `No paid invoices yet from ${client.displayName}.`
  );
  if (overdue.length > 0) {
    lines.push(`${overdue.length} invoice${overdue.length === 1 ? " is" : "s are"} currently overdue — a follow-up is recommended.`);
  }
  if (lastInvoice) {
    lines.push(`Last invoice ${lastInvoice.number} was issued on ${formatDate(lastInvoice.issueDate)}.`);
  }
  if (client.tags && client.tags.length > 0) {
    lines.push(`Tagged as ${client.tags.join(", ")}.`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-primary" /> AI customer summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {lines.map((line, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
