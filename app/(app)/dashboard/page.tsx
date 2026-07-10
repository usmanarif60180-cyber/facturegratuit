"use client";

import * as React from "react";
import { DollarSign, FileText, FileSpreadsheet, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart, type RevenuePoint } from "@/components/dashboard/RevenueChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Skeleton } from "@/components/ui/Skeleton";
import { useInvoices } from "@/hooks/useInvoices";
import { useQuotes } from "@/hooks/useQuotes";
import { useClients } from "@/hooks/useClients";
import { useOrganization } from "@/hooks/useOrganization";
import { formatCurrency } from "@/lib/utils/format";

function buildRevenueSeries(invoices: ReturnType<typeof useInvoices>["items"]): RevenuePoint[] {
  const months: RevenuePoint[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ month: d.toLocaleString("en", { month: "short" }), revenue: 0 });
  }

  for (const invoice of invoices) {
    if (invoice.status !== "paid") continue;
    const issued = new Date(invoice.issueDate);
    const diffMonths =
      (now.getFullYear() - issued.getFullYear()) * 12 + (now.getMonth() - issued.getMonth());
    if (diffMonths >= 0 && diffMonths <= 5) {
      const index = 5 - diffMonths;
      months[index]!.revenue += invoice.totals.total;
    }
  }

  return months;
}

export default function DashboardPage() {
  const { items: invoices, loading: invoicesLoading } = useInvoices();
  const { items: quotes, loading: quotesLoading } = useQuotes();
  const { items: clients, loading: clientsLoading } = useClients();
  const { organization } = useOrganization();

  const currency = organization?.settings.defaultCurrency ?? "USD";
  const loading = invoicesLoading || quotesLoading || clientsLoading;

  const revenue = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.totals.total, 0);

  const outstanding = invoices
    .filter((inv) => inv.status === "pending" || inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.totals.total, 0);

  const revenueSeries = React.useMemo(() => buildRevenueSeries(invoices), [invoices]);

  return (
    <div>
      <PageHeader title="Dashboard" description="A snapshot of your business, in real time." />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Revenue" value={formatCurrency(revenue, currency)} icon={DollarSign} />
          <StatCard
            label="Outstanding"
            value={formatCurrency(outstanding, currency)}
            icon={DollarSign}
          />
          <StatCard label="Invoices" value={String(invoices.length)} icon={FileText} />
          <StatCard label="Quotes" value={String(quotes.length)} icon={FileSpreadsheet} />
          <StatCard label="Clients" value={String(clients.length)} icon={Users} />
        </div>
      )}

      <div className="mt-6">
        <QuickActions />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueSeries} />
        </div>
        <RecentActivity invoices={invoices} />
      </div>
    </div>
  );
}
