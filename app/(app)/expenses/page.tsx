"use client";

import * as React from "react";
import { CheckCircle2, MoreHorizontal, Plus, Search, XCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@/components/ui/Dropdown";
import { ExportMenu } from "@/components/shared/ExportMenu";
import { useToast } from "@/components/ui/Toast";
import { useExpenses } from "@/hooks/useExpenses";
import { useOrganization } from "@/hooks/useOrganization";
import { expenseService } from "@/lib/services/expenseService";
import { ExpenseFormDialog } from "@/components/expenses/ExpenseFormDialog";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Expense, ExpenseApprovalStatus } from "@/types";

const APPROVAL_VARIANTS: Record<ExpenseApprovalStatus, BadgeProps["variant"]> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

const APPROVAL_LABELS: Record<ExpenseApprovalStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export default function ExpensesPage() {
  const { items: expenses, loading, organizationId } = useExpenses();
  const { organization } = useOrganization();
  const { toast } = useToast();

  const [search, setSearch] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Expense | null>(null);

  const filtered = expenses.filter(
    (e) =>
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase())
  );

  const total = filtered.reduce((sum, e) => sum + e.amount, 0);

  async function handleDelete(expense: Expense) {
    if (!organizationId) return;
    await expenseService.remove(organizationId, expense.id);
    toast({ variant: "success", title: "Expense removed" });
  }

  async function handleApproval(expense: Expense, approvalStatus: ExpenseApprovalStatus) {
    if (!organizationId) return;
    await expenseService.update(organizationId, expense.id, { approvalStatus });
    toast({ variant: "success", title: `Expense ${approvalStatus}` });
  }

  return (
    <div>
      <PageHeader
        title="Expenses"
        description="Track business spending by category."
        action={
          <div className="flex items-center gap-2">
            <ExportMenu
              filename="expenses"
              showPdf={false}
              columns={[
                { header: "Title", value: (e: Expense) => e.title },
                { header: "Category", value: (e: Expense) => e.category },
                { header: "Date", value: (e: Expense) => formatDate(e.date) },
                { header: "Vendor", value: (e: Expense) => e.vendor ?? "" },
                { header: "Amount", value: (e: Expense) => e.amount },
                { header: "Currency", value: (e: Expense) => e.currency },
                { header: "Status", value: (e: Expense) => e.approvalStatus ?? "" },
              ]}
              rows={filtered}
            />
            <Button
              className="gap-2"
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" /> Add expense
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search expenses…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {filtered.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Total: <span className="font-semibold text-foreground">{formatCurrency(total, organization?.settings.defaultCurrency ?? "USD")}</span>
          </p>
        )}
      </div>

      {loading ? (
        <div className="rounded-lg border border-border">
          <TableSkeleton />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          illustration="payment-processing"
          title={expenses.length === 0 ? "No expenses yet" : "No expenses match your search"}
          action={
            expenses.length === 0 ? (
              <Button onClick={() => setDialogOpen(true)}>Add expense</Button>
            ) : undefined
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((expense) => {
              const approval = expense.approvalStatus ?? "pending";
              return (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">
                    {expense.title}
                    {expense.recurring && (
                      <Badge variant="info" className="ml-2 align-middle">
                        Recurring
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge>{expense.category}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(expense.date)}</TableCell>
                  <TableCell>{expense.vendor ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={APPROVAL_VARIANTS[approval]}>{APPROVAL_LABELS[approval]}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(expense.amount, expense.currency)}
                  </TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button variant="ghost" size="icon" aria-label="Expense actions">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        {approval !== "approved" && (
                          <DropdownItem onSelect={() => handleApproval(expense, "approved")}>
                            <CheckCircle2 className="h-4 w-4" /> Approve
                          </DropdownItem>
                        )}
                        {approval !== "rejected" && (
                          <DropdownItem onSelect={() => handleApproval(expense, "rejected")}>
                            <XCircle className="h-4 w-4" /> Reject
                          </DropdownItem>
                        )}
                        <DropdownItem
                          onSelect={() => {
                            setEditing(expense);
                            setDialogOpen(true);
                          }}
                        >
                          Edit
                        </DropdownItem>
                        <DropdownItem onSelect={() => handleDelete(expense)} className="text-danger">
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {organizationId && (
        <ExpenseFormDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          organizationId={organizationId}
          defaultCurrency={organization?.settings.defaultCurrency ?? "USD"}
          expense={editing}
        />
      )}
    </div>
  );
}
