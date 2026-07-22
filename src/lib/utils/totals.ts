import type { DocumentTotals, LineItem, TaxRate } from "@/types";

/**
 * Computes subtotal, discount, tax and grand total for a set of line items.
 * Shared by the Invoice and Quote builders so totals math never drifts apart.
 */
export function calculateTotals(lineItems: LineItem[], taxRates: TaxRate[]): DocumentTotals {
  let subtotal = 0;
  let discountTotal = 0;
  let taxTotal = 0;

  for (const item of lineItems) {
    const lineGross = item.quantity * item.unitPrice;
    subtotal += lineGross;

    let lineDiscount = 0;
    if (item.discount) {
      lineDiscount =
        item.discount.type === "percentage"
          ? lineGross * (item.discount.value / 100)
          : item.discount.value;
    }
    discountTotal += lineDiscount;

    const taxableAmount = lineGross - lineDiscount;
    const taxRate = taxRates.find((t) => t.id === item.taxRateId);
    if (taxRate) {
      taxTotal += taxableAmount * (taxRate.rate / 100);
    }
  }

  const total = subtotal - discountTotal + taxTotal;

  return {
    subtotal: round(subtotal),
    discountTotal: round(discountTotal),
    taxTotal: round(taxTotal),
    total: round(total),
  };
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
