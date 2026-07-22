import { doc, runTransaction } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { createOrgScopedService } from "@/lib/firebase/firestoreService";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { Invoice, InvoiceStatus, LineItem, TaxRate } from "@/types";
import { calculateTotals } from "@/lib/utils/totals";

const base = createOrgScopedService<Invoice>(COLLECTIONS.invoices);

/** Atomically reserves the next invoice number from the org's counter. */
async function reserveInvoiceNumber(organizationId: string): Promise<string> {
  const orgRef = doc(db, "organizations", organizationId);
  return runTransaction(db, async (tx) => {
    const orgSnap = await tx.get(orgRef);
    const org = orgSnap.data();
    const prefix = org?.settings?.invoicePrefix ?? "INV-";
    const next = org?.settings?.nextInvoiceNumber ?? 1;
    tx.update(orgRef, { "settings.nextInvoiceNumber": next + 1 });
    return `${prefix}${String(next).padStart(4, "0")}`;
  });
}

async function createInvoice(
  organizationId: string,
  input: Omit<Invoice, "id" | "organizationId" | "createdAt" | "updatedAt" | "number" | "status" | "totals"> & {
    status?: InvoiceStatus;
    taxRates: TaxRate[];
  }
) {
  const { taxRates, ...rest } = input;
  const number = await reserveInvoiceNumber(organizationId);
  const totals = calculateTotals(rest.lineItems, taxRates);
  return base.create(organizationId, {
    ...rest,
    number,
    status: input.status ?? "draft",
    totals,
  });
}

function recalculateLineItems(lineItems: LineItem[], taxRates: TaxRate[]) {
  return calculateTotals(lineItems, taxRates);
}

async function markStatus(organizationId: string, invoiceId: string, status: InvoiceStatus) {
  const extra = status === "paid" ? { paidAt: new Date().toISOString() } : {};
  await base.update(organizationId, invoiceId, { status, ...extra });
}

async function duplicateInvoice(organizationId: string, invoice: Invoice) {
  const number = await reserveInvoiceNumber(organizationId);
  const { id: _id, createdAt: _c, updatedAt: _u, number: _n, status: _s, paidAt: _p, sentAt: _sa, ...rest } = invoice;
  return base.create(organizationId, { ...rest, number, status: "draft" });
}

export const invoiceService = {
  ...base,
  createInvoice,
  recalculateLineItems,
  markStatus,
  duplicateInvoice,
};
