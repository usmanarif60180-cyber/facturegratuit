import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const source = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
const section = (start, end) => {
  const first = source.indexOf(start);
  const last = source.indexOf(end, first);
  assert.ok(first >= 0 && last > first, `Missing section: ${start}`);
  return source.slice(first, last);
};
const nodes = new Map();
const node = (id) => {
  if (!nodes.has(id)) nodes.set(id, { innerHTML: "" });
  return nodes.get(id);
};
let clickHandler;
let localSaves = 0;
let cloudSaves = 0;
const context = vm.createContext({
  EXPENSES: [], INVOICES: [], CLIENTS: [], QUOTES: [], PRODUCTS: [],
  window: {
    profacturePersistWorkspaceLocal: () => { localSaves++; },
    profactureSyncWorkspaceCloud: () => { cloudSaves++; }
  },
  document: {
    querySelector: node,
    getElementById: (id) => id === "exp-tabs" ? null : node(id),
    body: { addEventListener: (_event, callback) => { clickHandler = callback; } }
  },
  activeCompanyItems: (items) => items.filter((item) => item.companyId === "company-a"),
  belongsToActiveCompany: (item) => item.companyId === "company-a",
  escapeHtml: (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"),
  currency: (amount) => `EUR ${amount}`,
  t: (key) => key,
  showToast: () => {},
  Date
});

vm.runInContext(section("function expApprovalBadgeClass", "function populateExpenseCategorySelect"), context);
const currentDate = new Date().toISOString().slice(0, 10);
context.EXPENSES.push(
  { id: "expense-a", companyId: "company-a", title: '<img src=x onerror=alert(1)>', category: '<svg onload=alert(1)>', vendor: '<b>vendor</b>', date: currentDate, amount: 10, approval: "Pending" },
  { id: "expense-b", companyId: "company-b", title: "PRIVATE", category: "PRIVATE", vendor: "PRIVATE", date: currentDate, amount: 90, approval: "Pending" }
);
context.renderExpensesAll();
assert.match(node("#expenses-table tbody").innerHTML, /&lt;img/);
assert.doesNotMatch(node("#expenses-table tbody").innerHTML, /<img|PRIVATE/);
assert.match(node("exp-category-bars").innerHTML, /&lt;svg/);
assert.doesNotMatch(node("exp-category-bars").innerHTML, /PRIVATE/);
assert.doesNotMatch(node("#exp-annual-table tbody").innerHTML, /PRIVATE/);
assert.match(node("exp-stat-grid").innerHTML, /EUR 10/);
assert.doesNotMatch(node("exp-stat-grid").innerHTML, /EUR 100/);

vm.runInContext(section("var expTabsEl = document.getElementById(\"exp-tabs\")", "// add-expense modal"), context);
assert.equal(typeof clickHandler, "function");
const click = (attribute, value) => clickHandler({ target: { closest: (selector) => selector === `[${attribute}]` ? { getAttribute: () => value } : null } });
click("data-exp-approve", "expense-a");
assert.equal(context.EXPENSES[0].approval, "Approved");
assert.ok(context.EXPENSES[0].updatedAt);
assert.equal(localSaves, 1);
assert.equal(cloudSaves, 1);
click("data-exp-reject", "expense-b");
assert.equal(context.EXPENSES[1].approval, "Pending");

context.invoiceBalance = (invoice) => invoice.balance;
context.aiMonthStats = () => ({ revenue: 10, expenses: 10, profit: 0 });
context.clientLifetimeValue = () => 0;
context.fmtDate = (date) => date;
context.INVOICES.push(
  { companyId: "company-a", status: "Overdue", client: '<img src=x onerror=alert(1)>', balance: 10 },
  { companyId: "company-b", status: "Overdue", client: "PRIVATE", balance: 1000 }
);
vm.runInContext(section("function computeAIInsights()", "renderAIInsights(\"dash-ai-insights-list\", 3)"), context);
context.renderAIInsights("insights", 3);
assert.match(node("insights").innerHTML, /&lt;img/);
assert.doesNotMatch(node("insights").innerHTML, /<img|PRIVATE|1010/);

context.dashboardProjectTab = "labour";
context.dashboardIntelTable = (rows) => JSON.stringify(rows);
context.window.ProFactureFinancial = {
  labourCostMinor: (entries) => entries[0].totalCostMinor,
  fromMinor: (minor) => minor / 100
};
context.fmtDate = (date) => date;
context.formatCurrency = (amount) => `EUR ${amount}`;
vm.runInContext(section("function dashboardProjectIntel(project, data)", "function dashboardAiPrompt(prompt)"), context);
const labourPanel = context.dashboardProjectIntel({}, {
  code: "EUR", expenses: [], labourEntries: [
    { employee: "Alice", date: currentDate, hours: 2, totalCostMinor: 5000 },
    { employee: "Linked expense", expenseId: "expense-a", date: currentDate, totalCostMinor: 1000 }
  ]
});
assert.match(labourPanel, /Alice/);
assert.match(labourPanel, /EUR 50/);
assert.doesNotMatch(labourPanel, /Linked expense/);

console.log("Dashboard bugfix checks passed: company isolation, HTML escaping, approval persistence and labour entries.");
