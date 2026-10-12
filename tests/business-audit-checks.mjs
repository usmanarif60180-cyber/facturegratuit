import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const rules = readFileSync(new URL("../firestore.rules", import.meta.url), "utf8");
const start = html.indexOf("function belongsToActiveCompany(item)");
const end = html.indexOf("function renderCompanyScopedViews()", start);
assert.ok(start > 0 && end > start);

const context = {
  wsActiveId: "company-a",
  managedCompanyWorkspaces: () => [{ id: "company-a", name: "Alpha" }, { id: "company-b", name: "Beta" }]
};
vm.createContext(context);
vm.runInContext(html.slice(start, end), context);
const legacy = { id: "invoice-1", companyProfile: { name: "Beta" } };
assert.equal(context.belongsToActiveCompany(legacy), false);
assert.equal(legacy.companyId, undefined, "Reading must not rewrite a legacy record");
context.wsActiveId = "company-b";
assert.equal(context.belongsToActiveCompany(legacy), true);
assert.equal(legacy.companyId, undefined);
context.managedCompanyWorkspaces = () => [{ id: "company-a", name: "Beta" }, { id: "company-b", name: "Beta" }];
assert.equal(context.belongsToActiveCompany(legacy), false, "Ambiguous names must not expose a record");

assert.match(html, /id="invite-send-btn"[^>]*disabled/);
assert.match(html, /No shared team is connected to this workspace/);
assert.doesNotMatch(html, /PENDING_INVITES\.push\(/);
assert.match(rules, /match \/companies\/\{companyId\} \{\s*allow read: if isActiveMember\(companyId\);\s*allow create: if false/);

const values = Array.from({ length: 8 }, () => ({ textContent: "", setAttribute() {}, removeAttribute() {} }));
const cards = Array.from({ length: 8 }, () => ({ title: "" }));
const icons = Array.from({ length: 8 }, () => ({ textContent: "" }));
const statsContext = {
  document: { getElementById: () => ({ querySelectorAll: selector => selector === ".val" ? values : selector === ".stat-card" ? cards : icons }) },
  INVOICES: [
    { companyId: "company-a", status: "Sent", currency: "EUR", htMinor: 10000, total: 120, payments: [{ amount: 20 }] },
    { companyId: "company-a", status: "Draft", currency: "EUR", htMinor: 90000, total: 1080, payments: [] },
    { companyId: "company-a", status: "Sent", currency: "USD", htMinor: 50000, total: 600, payments: [] }
  ],
  QUOTES: [], CLIENTS: [], EXPENSES: [{ companyId: "company-a", currency: "EUR", amountHT: 30, amountTTC: 36 }],
  activeCompanyItems: items => items.filter(item => item.companyId === "company-a"),
  currentCurrency: "EUR", currency: amount => `EUR ${amount}`, currencySymbol: () => "EUR",
  invoicePaidTotal: invoice => invoice.payments.reduce((sum, payment) => sum + payment.amount, 0),
  invoiceBalance: invoice => invoice.total - invoice.payments.reduce((sum, payment) => sum + payment.amount, 0),
  window: { ProFactureFinancial: { fromMinor: amount => amount / 100 } }
};
vm.createContext(statsContext);
const statsStart = html.indexOf("function renderDashboardStats()");
const statsEnd = html.indexOf("function renderDashboardWidgets()", statsStart);
vm.runInContext(html.slice(statsStart, statsEnd), statsContext);
statsContext.renderDashboardStats();
assert.deepEqual(values.slice(0, 5).map(value => value.textContent), ["EUR 100", "EUR 70", "EUR 30", "EUR -16", "EUR 100"]);
assert.match(cards[0].title, /excluding tax/);
console.log("Business audit checks passed: non-mutating company isolation and no fake team writes.");
