import { createOrgScopedService } from "@/lib/firebase/firestoreService";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { invoiceService } from "@/lib/services/invoiceService";
import type { Payment, PaymentMethod } from "@/types";

const base = createOrgScopedService<Payment>(COLLECTIONS.payments);

/**
 * Records a payment against an invoice and keeps the invoice's own totals
 * and status in sync — the single source of truth for "how much is owed"
 * stays on the invoice (totals.amountPaid/amountDue), payments is the
 * append-only history behind it.
 */
async function recordPayment(
  organizationId: string,
  input: { invoiceId: string; clientId: string; amount: number; currency: string; method: PaymentMethod; date: string; note?: string }
) {
  const paymentId = await base.create(organizationId, input);

  const invoice = await invoiceService.get(organizationId, input.invoiceId);
  if (invoice) {
    const previouslyPaid = invoice.totals.amountPaid ?? 0;
    const amountPaid = round(previouslyPaid + input.amount);
    const amountDue = round(invoice.totals.total - amountPaid);
    const status = amountDue <= 0 ? "paid" : "partially_paid";

    await invoiceService.update(organizationId, invoice.id, {
      totals: { ...invoice.totals, amountPaid, amountDue: Math.max(amountDue, 0) },
      status,
      ...(status === "paid" ? { paidAt: new Date().toISOString() } : {}),
    });
  }

  return paymentId;
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

export const paymentService = { ...base, recordPayment };
