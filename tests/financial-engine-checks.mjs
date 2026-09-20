import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const engine = require("../financial-engine.js");
const serverEngine = require("../functions/lib/financial-engine.js");

assert.equal(engine.toMinor("1666,67"), 166667);
assert.equal(engine.toMinor("1.005"), 101);
assert.equal(engine.toMinor("-1.005"), -101);
assert.equal(engine.vatMinor(166667, 2000), 33333);

const profitability = engine.chantierSummary({
  quotes: [{ id: "q1", status: "Accepted", acceptedHtMinor: 2000000 }],
  amendments: [{ id: "a-draft", status: "Draft", htMinor: 900000 }],
  invoices: [{ id: "i1", status: "Sent", htMinor: 2000000, payableMinor: 2400000 }],
  payments: [],
  expenses: [
    { category: "Matériaux", htMinor: 500000, approval: "Approved" },
    { category: "Carburant", htMinor: 50000, approval: "Approved" }
  ],
  labourEntries: [{ hours: 100, hourlyCostMinor: 2000 }]
});
assert.equal(profitability.contractMinor, 2000000);
assert.equal(profitability.directCostsMinor, 750000);
assert.equal(profitability.grossMarginMinor, 1250000);
assert.equal(profitability.marginBasisPoints, 6250);
assert.equal(engine.acceptedContractMinor([
  { id: "q-old", status: "Accepted", acceptedHtMinor: 100000, supersededBy: "q-new" },
  { id: "q-new", status: "Accepted", acceptedHtMinor: 120000 }
], []), 120000);
assert.deepEqual(serverEngine.summary({
  quotes: [{ id: "q1", status: "Accepted", acceptedHtMinor: 2000000 }],
  invoices: [{ id: "i1", status: "Sent", htMinor: 2000000, payableMinor: 2400000 }],
  expenses: [{ htMinor: 750000, approval: "Approved" }]
}), {
  contractMinor: 2000000,
  invoicedHtMinor: 2000000,
  invoicePayableMinor: 2400000,
  receivedMinor: 0,
  directCostsMinor: 750000,
  grossMarginMinor: 1250000,
  remainingToInvoiceMinor: 0,
  outstandingMinor: 2400000,
  marginBasisPoints: 6250,
  grossMarginBasis: "net invoiced revenue HT",
  overInvoicedMinor: 0,
  overpaidMinor: 0
});

const paymentBalance = engine.chantierSummary({
  invoices: [{ id: "i2", status: "Sent", htMinor: 1666667, payableMinor: 2000000 }],
  payments: [{ allocations: [{ invoiceId: "i2", amountMinor: 1000000 }] }]
});
assert.equal(paymentBalance.receivedMinor, 1000000);
assert.equal(paymentBalance.outstandingMinor, 1000000);

const sharedPayment = {
  id: "payment-shared", date: "2026-09-10",
  allocations: [{ invoiceId: "i-shared", amountMinor: 20000 }]
};
const sharedInvoice = {
  id: "i-shared", issue: "2026-09-01", status: "Sent", htMinor: 50000, payableMinor: 60000,
  payments: [{ id: "payment-shared", date: "2026-09-10", amountMinor: 20000 }]
};
const sharedInput = { invoices: [sharedInvoice], payments: [sharedPayment] };
assert.equal(engine.chantierSummary(sharedInput).receivedMinor, 20000);
assert.equal(serverEngine.summary(sharedInput).receivedMinor, 20000);
assert.equal(engine.periodActivity({ ...sharedInput, range: { start: "2026-09-01", end: "2026-09-30" } }).receivedMinor, 20000);
assert.equal(serverEngine.periodActivity({ ...sharedInput, range: { start: "2026-09-01", end: "2026-09-30" } }).receivedMinor, 20000);

const creditAndPartial = engine.chantierSummary({
  invoices: [
    { id: "i3", status: "Sent", htMinor: 100000, payableMinor: 120000 },
    { id: "c1", status: "Sent", invoiceType: "Avoir", htMinor: 10000, payableMinor: 12000 }
  ],
  payments: [{ allocations: [{ invoiceId: "i3", amountMinor: 50000 }, { invoiceId: "outside", amountMinor: 99999 }] }]
});
assert.equal(creditAndPartial.invoicedHtMinor, 90000);
assert.equal(creditAndPartial.invoicePayableMinor, 108000);
assert.equal(creditAndPartial.receivedMinor, 50000);

const labourNoDoubleCount = engine.directCostsMinor(
  [{ id: "expense-labour", htMinor: 20000, approval: "Approved" }],
  [{ expenseId: "expense-labour", totalCostMinor: 20000 }]
);
assert.equal(labourNoDoubleCount, 20000);
assert.equal(engine.directCostsMinor([{ htMinor: 0, amountMinor: 1200, approval: "Approved" }], []), 0);
assert.equal(serverEngine.summary({ expenses: [{ htMinor: 0, amountMinor: 1200, approval: "Approved" }] }).directCostsMinor, 0);
assert.equal(engine.labourCostMinor([{ hours: 7.5, hourlyCostMinor: 2345 }]), 17588);
assert.deepEqual(Object.assign({}, engine.costCategoriesMinor(
  [{ category: "Matériaux", htMinor: 500000, approval: "Approved" }, { category: "Carburant", htMinor: 50000, approval: "Approved" }],
  [{ hours: 100, hourlyCostMinor: 2000 }]
)), { "Matériaux": 500000, "Carburant": 50000, "Main-d’œuvre": 200000 });
assert.deepEqual(Object.assign({}, serverEngine.costCategoriesMinor(
  [{ category: "Matériaux", htMinor: 500000, approval: "Approved" }],
  [{ hours: 100, hourlyCostMinor: 2000 }]
)), { "Matériaux": 500000, "Main-d’œuvre": 200000 });

const ranged = engine.filterByRange([
  { date: "2026-08-31" },
  { date: "2026-09-01" },
  { date: "2026-09-30" },
  { date: "2026-10-01" },
  {}
], { start: "2026-09-01", end: "2026-09-30" });
assert.equal(ranged.length, 2);

const period = engine.periodActivity({
  range: { start: "2026-09-01", end: "2026-09-30" },
  invoices: [
    { id: "old", issue: "2026-08-20", status: "Sent", htMinor: 100000, payableMinor: 120000, payments: [{ date: "2026-09-03", amountMinor: 20000 }] },
    { id: "new", issue: "2026-09-05", status: "Sent", htMinor: 50000, payableMinor: 60000 }
  ],
  payments: [{ date: "2026-09-10", allocations: [{ invoiceId: "old", amountMinor: 30000 }] }],
  expenses: [{ date: "2026-09-12", htMinor: 10000, approval: "Approved" }]
});
assert.equal(period.invoicedHtMinor, 50000);
assert.equal(period.receivedMinor, 50000);
assert.equal(period.directCostsMinor, 10000);
assert.equal(period.grossMarginMinor, 40000);
assert.deepEqual(serverEngine.periodActivity({
  range: { start: "2026-09-01", end: "2026-09-30" },
  invoices: [{ id: "old", issue: "2026-08-20", status: "Sent", htMinor: 100000, payableMinor: 120000 }],
  payments: [{ date: "2026-09-10", allocations: [{ invoiceId: "old", amountMinor: 30000 }] }]
}).receivedMinor, 30000);

console.log("Financial engine checks passed: money, VAT, contracts, credits, payments, fractional labour, margin and ranges.");
