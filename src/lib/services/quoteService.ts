import { doc, runTransaction } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { createOrgScopedService } from "@/lib/firebase/firestoreService";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { Quote, QuoteStatus, TaxRate } from "@/types";
import { calculateTotals } from "@/lib/utils/totals";
import { invoiceService } from "./invoiceService";

const base = createOrgScopedService<Quote>(COLLECTIONS.quotes);

async function reserveQuoteNumber(organizationId: string): Promise<string> {
  const orgRef = doc(db, "organizations", organizationId);
  return runTransaction(db, async (tx) => {
    const orgSnap = await tx.get(orgRef);
    const org = orgSnap.data();
    const prefix = org?.settings?.quotePrefix ?? "QUO-";
    const next = org?.settings?.nextQuoteNumber ?? 1;
    tx.update(orgRef, { "settings.nextQuoteNumber": next + 1 });
    return `${prefix}${String(next).padStart(4, "0")}`;
  });
}

async function createQuote(
  organizationId: string,
  input: Omit<Quote, "id" | "organizationId" | "createdAt" | "updatedAt" | "number" | "status" | "totals"> & {
    status?: QuoteStatus;
    taxRates: TaxRate[];
  }
) {
  const { taxRates, ...rest } = input;
  const number = await reserveQuoteNumber(organizationId);
  const totals = calculateTotals(rest.lineItems, taxRates);
  return base.create(organizationId, {
    ...rest,
    number,
    status: input.status ?? "draft",
    totals,
  });
}

async function markStatus(organizationId: string, quoteId: string, status: QuoteStatus) {
  await base.update(organizationId, quoteId, { status });
}

/** Converts an accepted quote into a draft invoice, preserving line items and totals. */
async function convertToInvoice(organizationId: string, quote: Quote, taxRates: TaxRate[]) {
  const issueDate = new Date().toISOString();
  const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

  const invoiceId = await invoiceService.createInvoice(organizationId, {
    clientId: quote.clientId,
    issueDate,
    dueDate,
    currency: quote.currency,
    lineItems: quote.lineItems,
    notes: quote.notes,
    terms: quote.terms,
    quoteId: quote.id,
    taxRates,
  });

  await base.update(organizationId, quote.id, {
    status: "converted",
    convertedInvoiceId: invoiceId,
  });

  return invoiceId;
}

export const quoteService = {
  ...base,
  createQuote,
  markStatus,
  convertToInvoice,
};
