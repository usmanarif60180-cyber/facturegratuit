"use client";

import * as React from "react";
import { DollarSign, FileSpreadsheet, TrendingDown, Users, Wallet } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueExpensesChart, type RevenueExpensePoint } from "@/components/dashboard/RevenueExpensesChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AiInsightsCard } from "@/components/dashboard/AiInsightsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { PipelineWidget } from "@/components/dashboard/PipelineWidget";
import { TasksTodayWidget } from "@/components/dashboard/TasksTodayWidget";
import { UpcomingWidget } from "@/components/dashboard/UpcomingWidget";
import { InventoryAlertsWidget } from "@/components/dashboard/InventoryAlertsWidget";
import { Skeleton } from "@/components/ui/Skeleton";
import { Reveal } from "@/components/ui/Reveal";
import { LiveIndicator } from "@/components/dashboard/LiveIndicator";
import { useInvoices } from "@/hooks/useInvoices";
import { useQuotes } from "@/hooks/useQuotes";
import { useClients } from "@/hooks/useClients";
import { useExpenses } from "@/hooks/useExpenses";
import { useLeads } from "@/hooks/useLeads";
import { useTasks } from "@/hooks/useTasks";
import { useProducts } from "@/hooks/useProducts";
import { useOrganization } from "@/hooks/useOrganization";
import { formatCurrency } from "@/lib/utils/format";

function buildRevenueExpenseSeries(
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

export default function DashboardPage() {
  const { items: invoices, loading: invoicesLoading, organizationId } = useInvoices();
  const { items: quotes, loading: quotesLoading } = useQuotes();
  const { items: clients, loading: clientsLoading } = useClients();
  const { items: expenses, loading: expensesLoading } = useExpenses();
  const { items: leads } = useLeads();
  const { items: tasks } = useTasks();
  const { items: products } = useProducts();
  const { organization } = useOrganization();

  const currency = organization?.settings.defaultCurrency ?? "USD";
  const loading = invoicesLoading || quotesLoading || clientsLoading || expensesLoading;

  const revenue = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.totals.total, 0);

  const OUTSTANDING_STATUSES = new Set(["pending", "sent", "viewed", "partially_paid", "overdue"]);
  const outstanding = invoices
    .filter((inv) => OUTSTANDING_STATUSES.has(inv.status))
    .reduce((sum, inv) => sum + (inv.totals.amountDue ?? inv.totals.total), 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netCashFlow = revenue - totalExpenses;

  const series = React.useMemo(() => buildRevenueExpenseSeries(invoices, expenses), [invoices, expenses]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={organization ? `${organization.name} — a snapshot of your business, in real time.` : "A snapshot of your business, in real time."}
        action={<LiveIndicator />}
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[
            { label: "Revenue", value: revenue, icon: DollarSign, formatValue: (n: number) => formatCurrency(n, currency) },
            { label: "Outstanding", value: outstanding, icon: DollarSign, formatValue: (n: number) => formatCurrency(n, currency) },
            { label: "Expenses", value: totalExpenses, icon: TrendingDown, formatValue: (n: number) => formatCurrency(n, currency) },
            { label: "Net cash flow", value: netCashFlow, icon: Wallet, formatValue: (n: number) => formatCurrency(n, currency) },
            { label: "Quotes", value: quotes.length, icon: FileSpreadsheet },
            { label: "Clients", value: clients.length, icon: Users },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 60}>
              <StatCard {...stat} />
            </Reveal>
          ))}
        </div>
      )}

      <div className="mt-6">
        <QuickActions />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueExpensesChart data={series} />
        </div>
        <div className="flex flex-col gap-6">
          <AiInsightsCard invoices={invoices} quotes={quotes} clients={clients} expenses={expenses} currency={currency} />
          <RecentActivity invoices={invoices} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PipelineWidget leads={leads} />
        <TasksTodayWidget tasks={tasks} organizationId={organizationId} />
        <UpcomingWidget invoices={invoices} quotes={quotes} tasks={tasks} expenses={expenses} />
        <InventoryAlertsWidget products={products} />
      </div>
    </div>
  );
}
