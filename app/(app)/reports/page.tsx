"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Reveal } from "@/components/ui/Reveal";
import { RevenueExpensesChart, type RevenueExpensePoint } from "@/components/dashboard/RevenueExpensesChart";
import { ConversionRing } from "@/components/dashboard/ConversionRing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ExportMenu } from "@/components/shared/ExportMenu";
import { useInvoices } from "@/hooks/useInvoices";
import { useQuotes } from "@/hooks/useQuotes";
import { useExpenses } from "@/hooks/useExpenses";
import { useClients } from "@/hooks/useClients";
import { useProducts } from "@/hooks/useProducts";
import { useOrganization } from "@/hooks/useOrganization";
import { formatCurrency } from "@/lib/utils/format";
import { DollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react";

const TREND_MONTHS = 12;
const OUTSTANDING_STATUSES = new Set(["pending", "sent", "viewed", "partially_paid", "overdue"]);

function buildSeries(
  invoices: ReturnType<typeof useInvoices>["items"],
  expenses: ReturnType<typeof useExpenses>["items"]
): RevenueExpensePoint[] {
  const months: RevenueExpensePoint[] = [];
  const now = new Date();

  for (let i = TREND_MONTHS - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ month: d.toLocaleString("en", { month: "short" }), revenue: 0, expenses: 0 });
  }

  const monthIndex = (dateStr: string) => {
    const d = new Date(dateStr);
    const diff = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
    return diff >= 0 && diff < TREND_MONTHS ? TREND_MONTHS - 1 - diff : -1;
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
  const { items: quotes } = useQuotes();
  const { items: expenses } = useExpenses();
  const { items: clients } = useClients();
  const { items: products } = useProducts();
  const { organization } = useOrganization();
  const currency = organization?.settings.defaultCurrency ?? "USD";

  const revenue = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.totals.total, 0);
  const outstanding = invoices
    .filter((i) => OUTSTANDING_STATUSES.has(i.status))
    .reduce((s, i) => s + (i.totals.amountDue ?? i.totals.total), 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const net = revenue - totalExpenses;

  const sentQuotes = quotes.filter((q) => q.status !== "draft");
  const acceptedQuotes = quotes.filter((q) => q.status === "accepted" || q.status === "converted");
  const quoteConversionRate = sentQuotes.length > 0 ? (acceptedQuotes.length / sentQuotes.length) * 100 : 0;

  const decidedInvoices = invoices.filter((i) => i.status !== "draft");
  const paidInvoices = invoices.filter((i) => i.status === "paid");
  const invoicePaidRate = decidedInvoices.length > 0 ? (paidInvoices.length / decidedInvoices.length) * 100 : 0;

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

  const bestSellingProducts = React.useMemo(() => {
    const map = new Map<string, { quantity: number; revenue: number }>();
    for (const invoice of invoices) {
      if (invoice.status !== "paid") continue;
      for (const item of invoice.lineItems) {
        if (!item.productId) continue;
        const entry = map.get(item.productId) ?? { quantity: 0, revenue: 0 };
        entry.quantity += item.quantity;
        entry.revenue += item.quantity * item.unitPrice;
        map.set(item.productId, entry);
      }
    }
    const productNameById = Object.fromEntries(products.map((p) => [p.id, p.name]));
    return Array.from(map.entries())
      .map(([productId, data]) => ({ name: productNameById[productId] ?? "Unknown product", ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [invoices, products]);

  const expensesByCategory = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const e of expenses) map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
    return Array.from(map.entries())
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }, [expenses]);

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Understand where your business stands."
        action={
          <ExportMenu
            filename="monthly-report"
            columns={[
              { header: "Month", value: (r: RevenueExpensePoint) => r.month },
              { header: "Revenue", value: (r: RevenueExpensePoint) => r.revenue },
              { header: "Expenses", value: (r: RevenueExpensePoint) => r.expenses },
              { header: "Net", value: (r: RevenueExpensePoint) => r.revenue - r.expenses },
            ]}
            rows={series}
          />
        }
      />

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
            <CardTitle>Top customers</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueByClient.length === 0 ? (
              <EmptyState
                illustration="business-analytics"
                title="No revenue yet"
                description="Paid invoices will rank your top customers here."
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

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Best selling products</CardTitle>
          </CardHeader>
          <CardContent>
            {bestSellingProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No paid invoices with catalog products yet.</p>
            ) : (
              <ul className="space-y-3">
                {bestSellingProducts.map((p) => (
                  <li key={p.name} className="flex items-center justify-between text-sm">
                    <span>
                      {p.name} <span className="text-muted-foreground">× {p.quantity}</span>
                    </span>
                    <span className="font-medium">{formatCurrency(p.revenue, currency)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses by category</CardTitle>
          </CardHeader>
          <CardContent>
            {expensesByCategory.length === 0 ? (
              <p className="text-sm text-muted-foreground">No expenses logged yet.</p>
            ) : (
              <ul className="space-y-3">
                {expensesByCategory.map((c) => (
                  <li key={c.category} className="flex items-center justify-between text-sm">
                    <span>{c.category}</span>
                    <span className="font-medium">{formatCurrency(c.total, currency)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversion</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap justify-center gap-10 py-4 sm:justify-start">
            <ConversionRing label="Quotes accepted" percent={quoteConversionRate} />
            <ConversionRing label="Invoices paid" percent={invoicePaidRate} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
