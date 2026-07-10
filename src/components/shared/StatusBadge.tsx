import { Badge, type BadgeProps } from "@/components/ui/Badge";
import type { InvoiceStatus } from "@/types/invoice";
import type { QuoteStatus } from "@/types/quote";

const INVOICE_VARIANTS: Record<InvoiceStatus, BadgeProps["variant"]> = {
  draft: "default",
  pending: "warning",
  paid: "success",
  overdue: "danger",
  canceled: "default",
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
  return <Badge variant={INVOICE_VARIANTS[status]}>{labelize(status)}</Badge>;
}

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  return <Badge variant={QUOTE_VARIANTS[status]}>{labelize(status)}</Badge>;
}
