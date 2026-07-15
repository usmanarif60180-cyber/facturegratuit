"use client";

import * as React from "react";
import Link from "next/link";
import { FilePlus2, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonVariants } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { InvoiceStatusBadge, INVOICE_LABELS } from "@/components/shared/StatusBadge";
import { useInvoices } from "@/hooks/useInvoices";
import { useClients } from "@/hooks/useClients";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { InvoiceStatus } from "@/types";
import { cn } from "@/lib/utils/cn";

const STATUS_FILTERS: Array<InvoiceStatus | "all"> = [
  "all",
  "draft",
  "sent",
  "viewed",
  "partially_paid",
  "paid",
  "overdue",
  "canceled",
  "refunded",
];

export default function InvoicesPage() {
  const { items: invoices, loading } = useInvoices();
  const { items: clients } = useClients();
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<InvoiceStatus | "all">("all");

  const clientNameById = React.useMemo(
    () => Object.fromEntries(clients.map((c) => [c.id, c.displayName])),
    [clients]
  );

  const filtered = invoices.filter((invoice) => {
    const clientName = clientNameById[invoice.clientId] ?? "";
    const matchesSearch =
      !search ||
      invoice.number.toLowerCase().includes(search.toLowerCase()) ||
      clientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || invoice.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Create, send and track every invoice in one place."
        action={
          <Link href="/invoices/new" className={cn(buttonVariants(), "gap-2")}>
            <FilePlus2 className="h-4 w-4" /> New invoice
          </Link>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by number or client…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          className="sm:w-48"
          value={status}
          onChange={(e) => setStatus(e.target.value as InvoiceStatus | "all")}
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All statuses" : INVOICE_LABELS[s]}
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="rounded-lg border border-border">
          <TableSkeleton />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          illustration="invoice-generation"
          title={invoices.length === 0 ? "No invoices yet" : "No invoices match your filters"}
          description={
            invoices.length === 0
              ? "Create your first invoice to get started."
              : "Try adjusting your search or status filter."
          }
          action={
            invoices.length === 0 ? (
              <Link href="/invoices/new" className={buttonVariants()}>
                New invoice
              </Link>
            ) : undefined
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Issue date</TableHead>
              <TableHead>Due date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((invoice) => (
              <TableRow key={invoice.id} className="cursor-pointer">
                <TableCell>
                  <Link href={`/invoices/${invoice.id}`} className="font-medium text-primary">
                    {invoice.number}
                  </Link>
                </TableCell>
                <TableCell>{clientNameById[invoice.clientId] ?? "—"}</TableCell>
                <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                <TableCell>
                  <InvoiceStatusBadge status={invoice.status} />
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(invoice.totals.total, invoice.currency)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
