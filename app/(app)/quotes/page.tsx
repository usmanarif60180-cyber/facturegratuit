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
import { QuoteStatusBadge } from "@/components/shared/StatusBadge";
import { useQuotes } from "@/hooks/useQuotes";
import { useClients } from "@/hooks/useClients";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { QuoteStatus } from "@/types";
import { cn } from "@/lib/utils/cn";

const STATUS_FILTERS: Array<QuoteStatus | "all"> = [
  "all",
  "draft",
  "sent",
  "accepted",
  "declined",
  "expired",
  "converted",
];

export default function QuotesPage() {
  const { items: quotes, loading } = useQuotes();
  const { items: clients } = useClients();
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<QuoteStatus | "all">("all");

  const clientNameById = React.useMemo(
    () => Object.fromEntries(clients.map((c) => [c.id, c.displayName])),
    [clients]
  );

  const filtered = quotes.filter((quote) => {
    const clientName = clientNameById[quote.clientId] ?? "";
    const matchesSearch =
      !search ||
      quote.number.toLowerCase().includes(search.toLowerCase()) ||
      clientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || quote.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="Quotes"
        description="Send polished quotations and convert accepted ones into invoices."
        action={
          <Link href="/quotes/new" className={cn(buttonVariants(), "gap-2")}>
            <FilePlus2 className="h-4 w-4" /> New quote
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
          onChange={(e) => setStatus(e.target.value as QuoteStatus | "all")}
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
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
          illustration="quote-generation"
          title={quotes.length === 0 ? "No quotes yet" : "No quotes match your filters"}
          description={
            quotes.length === 0
              ? "Create your first quote to get started."
              : "Try adjusting your search or status filter."
          }
          action={
            quotes.length === 0 ? (
              <Link href="/quotes/new" className={buttonVariants()}>
                New quote
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
              <TableHead>Valid until</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell>
                  <Link href={`/quotes/${quote.id}`} className="font-medium text-primary">
                    {quote.number}
                  </Link>
                </TableCell>
                <TableCell>{clientNameById[quote.clientId] ?? "—"}</TableCell>
                <TableCell>{formatDate(quote.issueDate)}</TableCell>
                <TableCell>{formatDate(quote.expiryDate)}</TableCell>
                <TableCell>
                  <QuoteStatusBadge status={quote.status} />
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(quote.totals.total, quote.currency)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
