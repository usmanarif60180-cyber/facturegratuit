"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Reveal } from "@/components/ui/Reveal";
import { RevenueExpensesChart, type RevenueExpensePoint } from "@/components/dashboard/RevenueExpensesChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useInvoices } from "@/hooks/useInvoices";
import { useExpenses } from "@/hooks/useExpenses";
import { useClients } from "@/hooks/useClients";
import { useOrganization } from "@/hooks/useOrganization";
import { formatCurrency } from "@/lib/utils/format";
import { DollarSign, TrendingDown, TrendingUp, Wallet, BarChart3 } from "lucide-react";

function buildSeries(
  invoices: ReturnType<typeof useInvoices>["items"],
  expenses: ReturnType<typeof useExpenses>["items"]
): RevenueExpensePoint[] {
  const months: RevenueExpensePoint[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ month: d.toLocaleString("en", { month: "short" }), revenue: 0, expenses: 0 });
  }

  const monthIndex = (dateStr: string) => {
    const d = new Date(dateStr);
    const diff = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
    return diff >= 0 && diff <= 5 ? 5 - diff : -1;
  };

  for (const invoice of invoices) {
    if (invoice.status !== "paid") continue;
    const idx = monthIndex(invoice.issueDate);
    if (idx >= 0) months[idx]!.revenue += invoice.totals.total;
  }

  for (const expense of expenses) {
    const idx = monthIndex(expense.date);
    if (idx >= 0) months[idx]!.expenses += expense.amount;
  }

  return months;
}

export default function ReportsPage() {
  const { items: invoices } = useInvoices();
  const { items: expenses } = useExpenses();
  const { items: clients } = useClients();
  const { organization } = useOrganization();
  const currency = organization?.settings.defaultCurrency ?? "USD";

  const revenue = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.totals.total, 0);
  const outstanding = invoices
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((s, i) => s + i.totals.total, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const net = revenue - totalExpenses;

  const series = React.useMemo(() => buildSeries(invoices, expenses), [invoices, expenses]);

  const revenueByClient = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const invoice of invoices) {
      if (invoice.status !== "paid") continue;
      map.set(invoice.clientId, (map.get(invoice.clientId) ?? 0) + invoice.totals.total);
    }
    const clientNameById = Object.fromEntries(clients.map((c) => [c.id, c.displayName]));
    return Array.from(map.entries())
      .map(([clientId, total]) => ({ name: clientNameById[clientId] ?? "Unknown", total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [invoices, clients]);

  return (
    <div>
      <PageHeader title="Reports" description="Understand where your business stands." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Revenue", value: revenue, icon: TrendingUp },
          { label: "Outstanding", value: outstanding, icon: DollarSign },
          { label: "Expenses", value: totalExpenses, icon: TrendingDown },
          { label: "Net", value: net, icon: Wallet },
        ].map((stat, i) => (
          <Reveal key={stat.label} delay={i * 60}>
            <StatCard {...stat} formatValue={(n) => formatCurrency(n, currency)} />
          </Reveal>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueExpensesChart data={series} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Top clients</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueByClient.length === 0 ? (
              <EmptyState
                icon={<BarChart3 className="h-5 w-5" />}
                title="No revenue yet"
                description="Paid invoices will rank your top clients here."
              />
            ) : (
              <ul className="space-y-3">
                {revenueByClient.map((c) => (
                  <li key={c.name} className="flex items-center justify-between text-sm">
                    <span>{c.name}</span>
                    <span className="font-medium">{formatCurrency(c.total, currency)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
