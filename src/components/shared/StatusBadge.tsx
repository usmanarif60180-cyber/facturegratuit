import { Badge, type BadgeProps } from "@/components/ui/Badge";
import type { InvoiceStatus } from "@/types/invoice";
import type { QuoteStatus } from "@/types/quote";

const INVOICE_VARIANTS: Record<InvoiceStatus, BadgeProps["variant"]> = {
  draft: "default",
  pending: "warning",
  sent: "info",
  viewed: "info",
  partially_paid: "warning",
  paid: "success",
  overdue: "danger",
  canceled: "default",
  refunded: "secondary",
};

const INVOICE_LABELS: Record<InvoiceStatus, string> = {
  draft: "Draft",
  pending: "Sent",
  sent: "Sent",
  viewed: "Viewed",
  partially_paid: "Partially paid",
  paid: "Paid",
  overdue: "Overdue",
  canceled: "Cancelled",
  refunded: "Refunded",
};

const QUOTE_VARIANTS: Record<QuoteStatus, BadgeProps["variant"]> = {
  draft: "default",
  sent: "info",
  accepted: "success",
  declined: "danger",
  expired: "warning",
  converted: "primary",
};

function labelize(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return <Badge variant={INVOICE_VARIANTS[status]}>{INVOICE_LABELS[status]}</Badge>;
}

export { INVOICE_LABELS };

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  return <Badge variant={QUOTE_VARIANTS[status]}>{labelize(status)}</Badge>;
}
