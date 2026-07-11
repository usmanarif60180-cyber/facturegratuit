import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils/format";
import type { Client, Expense, Invoice, Quote } from "@/types";

interface AiInsightsCardProps {
  invoices: Invoice[];
  quotes: Quote[];
  clients: Client[];
  expenses: Expense[];
  currency: string;
}

/** Simple, honest client-side insights computed from the org's own data —
 * not a real model call. The AI Assistant elsewhere in the app is itself a
 * "coming soon" placeholder, so this deliberately doesn't pretend to be
 * more than deterministic analysis dressed in the same visual language. */
export function AiInsightsCard({ invoices, quotes, clients, expenses, currency }: AiInsightsCardProps) {
  const insights: string[] = [];

  const overdue = invoices.filter((i) => i.status === "overdue");
  if (overdue.length > 0) {
    const total = overdue.reduce((s, i) => s + i.totals.total, 0);
    insights.push(`${overdue.length} invoice${overdue.length > 1 ? "s" : ""} overdue totaling ${formatCurrency(total, currency)} — following up could improve cash flow.`);
  }

  const sentQuotes = quotes.filter((q) => q.status === "sent");
  if (sentQuotes.length > 0) {
    insights.push(`${sentQuotes.length} quote${sentQuotes.length > 1 ? "s are" : " is"} awaiting a response.`);
  }

  const revenueByClient = new Map<string, number>();
  for (const inv of invoices) {
    if (inv.status !== "paid") continue;
    revenueByClient.set(inv.clientId, (revenueByClient.get(inv.clientId) ?? 0) + inv.totals.total);
  }
  const topEntry = [...revenueByClient.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topEntry) {
    const topClient = clients.find((c) => c.id === topEntry[0]);
    if (topClient) insights.push(`${topClient.displayName} is your top client this period, at ${formatCurrency(topEntry[1], currency)}.`);
  }

  const thisMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  if (thisMonthExpenses.length > 0) {
    const total = thisMonthExpenses.reduce((s, e) => s + e.amount, 0);
    insights.push(`${formatCurrency(total, currency)} spent this month across ${thisMonthExpenses.length} expense${thisMonthExpenses.length > 1 ? "s" : ""}.`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <p className="text-sm text-muted-foreground">Insights will appear here as invoices, quotes and expenses come in.</p>
        ) : (
          <ul className="space-y-2.5 text-sm">
            {insights.slice(0, 4).map((text, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="text-muted-foreground">{text}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
