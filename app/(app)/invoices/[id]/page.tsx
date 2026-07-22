"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Copy, CreditCard, Loader2, Mail, Printer } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@/components/ui/Dropdown";
import { InvoicePreview } from "@/components/invoices/InvoicePreview";
import { RecordPaymentDialog } from "@/components/invoices/RecordPaymentDialog";
import { PaymentHistory } from "@/components/invoices/PaymentHistory";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { useOrganization } from "@/hooks/useOrganization";
import { invoiceService } from "@/lib/services/invoiceService";
import { clientService } from "@/lib/services/clientService";
import { paymentService } from "@/lib/services/paymentService";
import { notificationService } from "@/lib/services/notificationService";
import { where } from "@/lib/firebase/firestoreService";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { INVOICE_LABELS } from "@/components/shared/StatusBadge";
import type { Client, Invoice, InvoiceStatus, Payment } from "@/types";

const STATUS_OPTIONS: InvoiceStatus[] = [
  "draft",
  "sent",
  "viewed",
  "paid",
  "overdue",
  "canceled",
  "refunded",
];

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const { profile } = useAuth();
  const { organization } = useOrganization();
  const organizationId = profile?.organizationId;
  const invoiceId = params.id;

  const [invoice, setInvoice] = React.useState<Invoice | null>(null);
  const [client, setClient] = React.useState<Client | null>(null);
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false);

  const load = React.useCallback(async () => {
    if (!organizationId) return;
    setLoading(true);
    const inv = await invoiceService.get(organizationId, invoiceId);
    setInvoice(inv);
    if (inv) {
      const [c, p] = await Promise.all([
        clientService.get(organizationId, inv.clientId),
        paymentService.list(organizationId, [where("invoiceId", "==", inv.id)]),
      ]);
      setClient(c);
      setPayments(p);
    }
    setLoading(false);
  }, [organizationId, invoiceId]);

  React.useEffect(() => {
    load();
  }, [load]);

  async function handleStatusChange(status: InvoiceStatus) {
    if (!profile?.organizationId || !invoice) return;
    await invoiceService.markStatus(profile.organizationId, invoice.id, status);
    toast({ variant: "success", title: `Marked as ${INVOICE_LABELS[status]}` });
    if (status === "paid") {
      notificationService.notify(profile.organizationId, profile.id, {
        type: "invoice_paid",
        title: "Invoice paid",
        message: `${invoice.number} was marked as paid.`,
        linkTo: `/invoices/${invoice.id}`,
      });
    }
    load();
  }

  async function handleDuplicate() {
    if (!profile?.organizationId || !invoice) return;
    const id = await invoiceService.duplicateInvoice(profile.organizationId, invoice);
    toast({ variant: "success", title: "Invoice duplicated" });
    router.push(`/invoices/${id}`);
  }

  function handleSendReminder() {
    if (!invoice || !client?.email) return;
    const subject = encodeURIComponent(`Reminder: Invoice ${invoice.number}`);
    const outstanding = invoice.totals.amountDue ?? invoice.totals.total - (invoice.totals.amountPaid ?? 0);
    const body = encodeURIComponent(
      `Hi ${client.displayName},\n\nThis is a friendly reminder that invoice ${invoice.number} for ${formatCurrency(
        outstanding,
        invoice.currency
      )} was due on ${formatDate(invoice.dueDate)}.\n\nThanks!`
    );
    window.location.href = `mailto:${client.email}?subject=${subject}&body=${body}`;
    if (profile?.organizationId) {
      invoiceService.update(profile.organizationId, invoice.id, { lastReminderAt: new Date().toISOString() });
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!invoice) {
    return <p className="text-muted-foreground">Invoice not found.</p>;
  }

  const outstanding = Math.max(
    invoice.totals.amountDue ?? invoice.totals.total - (invoice.totals.amountPaid ?? 0),
    0
  );
  const isOverdue =
    invoice.status !== "paid" &&
    invoice.status !== "canceled" &&
    invoice.status !== "refunded" &&
    new Date(invoice.dueDate) < new Date();

  return (
    <div>
      <PageHeader
        title={invoice.number}
        description="Review, print or update this invoice."
        action={
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={() => router.push("/invoices")} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
              <Printer className="h-4 w-4" /> Print / PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleDuplicate} className="gap-2">
              <Copy className="h-4 w-4" /> Duplicate
            </Button>
            {outstanding > 0 && (
              <Button size="sm" onClick={() => setPaymentDialogOpen(true)} className="gap-2">
                <CreditCard className="h-4 w-4" /> Record payment
              </Button>
            )}
            {outstanding > 0 && client?.email && (
              <Button variant="outline" size="sm" onClick={handleSendReminder} className="gap-2">
                <Mail className="h-4 w-4" /> Send reminder
              </Button>
            )}
            <Dropdown>
              <DropdownTrigger>
                <Button variant="outline" size="sm">Update status</Button>
              </DropdownTrigger>
              <DropdownMenu>
                {STATUS_OPTIONS.map((status) => (
                  <DropdownItem key={status} onSelect={() => handleStatusChange(status)}>
                    Mark as {INVOICE_LABELS[status]}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        }
      />

      {isOverdue && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger print:hidden">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Overdue since {formatDate(invoice.dueDate)} — {formatCurrency(outstanding, invoice.currency)} outstanding.
        </div>
      )}

      {outstanding > 0 && outstanding < invoice.totals.total && (
        <div className="mb-4 rounded-lg border border-border bg-surface px-4 py-3 text-sm print:hidden">
          <span className="font-medium">{formatCurrency(invoice.totals.amountPaid ?? 0, invoice.currency)}</span> paid of{" "}
          {formatCurrency(invoice.totals.total, invoice.currency)} —{" "}
          <span className="font-medium text-warning">{formatCurrency(outstanding, invoice.currency)} outstanding</span>.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr,20rem]">
        <InvoicePreview invoice={invoice} client={client} organization={organization} />
        <div className="print:hidden">
          <PaymentHistory payments={payments} />
        </div>
      </div>

      {organizationId && (
        <RecordPaymentDialog
          open={paymentDialogOpen}
          onClose={() => setPaymentDialogOpen(false)}
          organizationId={organizationId}
          invoice={invoice}
          onRecorded={load}
        />
      )}
    </div>
  );
}
