import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Client, Expense, Invoice, Product, Quote } from "@/types";

/**
 * Deterministic keyword → answer matcher over the org's own live data. No
 * LLM is wired into this app (the generation capabilities in aiService.ts
 * are still "coming soon" placeholders) — this is the same honest pattern
 * as AiInsightsCard and the Design Studio's aiDesigner.ts: real computed
 * answers today, a drop-in replacement point for a model call later.
 */
export interface BusinessQueryData {
  invoices: Invoice[];
  quotes: Quote[];
  clients: Client[];
  expenses: Expense[];
  products: Product[];
  currency: string;
}

function clientName(clients: Client[], clientId: string) {
  return clients.find((c) => c.id === clientId)?.displayName ?? "Unknown client";
}

function isSameMonth(dateStr: string, ref: Date) {
  const d = new Date(dateStr);
  return d.getMonth() === ref.getMonth() && d.getFullYear() === ref.getFullYear();
}

function isSameDay(dateStr: string, ref: Date) {
  const d = new Date(dateStr);
  return d.toDateString() === ref.toDateString();
}

function overdueInvoices(data: BusinessQueryData) {
  return data.invoices.filter((i) => i.status === "overdue");
}

function outstandingInvoices(data: BusinessQueryData) {
  const statuses = new Set(["pending", "sent", "viewed", "partially_paid", "overdue"]);
  return data.invoices.filter((i) => statuses.has(i.status));
}

function monthlyRevenue(data: BusinessQueryData, ref: Date) {
  return data.invoices
    .filter((i) => i.status === "paid" && i.paidAt && isSameMonth(i.paidAt, ref))
    .reduce((sum, i) => sum + i.totals.total, 0);
}

function monthlyExpenses(data: BusinessQueryData, ref: Date) {
  return data.expenses.filter((e) => isSameMonth(e.date, ref)).reduce((sum, e) => sum + e.amount, 0);
}

interface Handler {
  test: (q: string) => boolean;
  answer: (data: BusinessQueryData) => string;
}

const HANDLERS: Handler[] = [
  {
    test: (q) => /overdue/.test(q),
    answer: (data) => {
      const list = overdueInvoices(data);
      if (list.length === 0) return "No overdue invoices right now — you're all caught up.";
      const total = list.reduce((s, i) => s + i.totals.total, 0);
      const lines = list
        .slice(0, 8)
        .map((i) => `• ${i.number} — ${clientName(data.clients, i.clientId)} — ${formatCurrency(i.totals.total, i.currency)} (due ${formatDate(i.dueDate)})`);
      return `${list.length} overdue invoice${list.length === 1 ? "" : "s"} totaling ${formatCurrency(total, data.currency)}:\n${lines.join("\n")}`;
    },
  },
  {
    test: (q) => /who paid|paid today|payments today/.test(q),
    answer: (data) => {
      const today = new Date();
      const paidToday = data.invoices.filter((i) => i.paidAt && isSameDay(i.paidAt, today));
      if (paidToday.length === 0) return "No invoices have been paid today yet.";
      const total = paidToday.reduce((s, i) => s + i.totals.total, 0);
      const lines = paidToday.map((i) => `• ${clientName(data.clients, i.clientId)} — ${formatCurrency(i.totals.total, i.currency)} (${i.number})`);
      return `${paidToday.length} invoice${paidToday.length === 1 ? "" : "s"} paid today, totaling ${formatCurrency(total, data.currency)}:\n${lines.join("\n")}`;
    },
  },
  {
    test: (q) => /profit/.test(q),
    answer: (data) => {
      const now = new Date();
      const revenue = monthlyRevenue(data, now);
      const expenses = monthlyExpenses(data, now);
      const profit = revenue - expenses;
      return `This month: ${formatCurrency(revenue, data.currency)} revenue − ${formatCurrency(
        expenses,
        data.currency
      )} expenses = ${formatCurrency(profit, data.currency)} profit.`;
    },
  },
  {
    test: (q) => /unpaid customer|unpaid client|who owes/.test(q),
    answer: (data) => {
      const outstanding = outstandingInvoices(data);
      if (outstanding.length === 0) return "No customers currently have unpaid invoices.";
      const byClient = new Map<string, number>();
      for (const inv of outstanding) {
        byClient.set(inv.clientId, (byClient.get(inv.clientId) ?? 0) + (inv.totals.amountDue ?? inv.totals.total));
      }
      const lines = [...byClient.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([clientId, amount]) => `• ${clientName(data.clients, clientId)} — ${formatCurrency(amount, data.currency)}`);
      return `${byClient.size} customer${byClient.size === 1 ? "" : "s"} with unpaid invoices:\n${lines.join("\n")}`;
    },
  },
  {
    test: (q) => /monthly report|report this month/.test(q),
    answer: (data) => {
      const now = new Date();
      const revenue = monthlyRevenue(data, now);
      const expenses = monthlyExpenses(data, now);
      const paidCount = data.invoices.filter((i) => i.status === "paid" && i.paidAt && isSameMonth(i.paidAt, now)).length;
      const newClients = data.clients.filter((c) => isSameMonth(c.createdAt, now)).length;
      const monthLabel = now.toLocaleString("en", { month: "long", year: "numeric" });
      return [
        `Monthly report — ${monthLabel}`,
        `• Revenue: ${formatCurrency(revenue, data.currency)}`,
        `• Expenses: ${formatCurrency(expenses, data.currency)}`,
        `• Profit: ${formatCurrency(revenue - expenses, data.currency)}`,
        `• Invoices paid: ${paidCount}`,
        `• New clients: ${newClients}`,
        `• Overdue invoices: ${overdueInvoices(data).length}`,
      ].join("\n");
    },
  },
  {
    test: (q) => /business summary|summarize|summary/.test(q),
    answer: (data) => {
      const totalRevenue = data.invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.totals.total, 0);
      const outstanding = outstandingInvoices(data);
      const outstandingTotal = outstanding.reduce((s, i) => s + (i.totals.amountDue ?? i.totals.total), 0);
      return [
        `You have ${data.clients.length} client${data.clients.length === 1 ? "" : "s"} and ${data.invoices.length} invoice${data.invoices.length === 1 ? "" : "s"} on record.`,
        `Lifetime paid revenue: ${formatCurrency(totalRevenue, data.currency)}.`,
        `${outstanding.length} invoice${outstanding.length === 1 ? " is" : "s are"} outstanding, worth ${formatCurrency(outstandingTotal, data.currency)}.`,
        `${data.quotes.filter((q) => q.status === "sent").length} quote${data.quotes.filter((q) => q.status === "sent").length === 1 ? " is" : "s are"} awaiting a response.`,
      ].join(" ");
    },
  },
  {
    test: (q) => /recommend|improve|suggestion/.test(q),
    answer: (data) => {
      const tips: string[] = [];
      const overdue = overdueInvoices(data);
      if (overdue.length > 0) tips.push(`Follow up on ${overdue.length} overdue invoice${overdue.length === 1 ? "" : "s"} — this is the fastest way to improve cash flow.`);
      const lowStock = data.products.filter((p) => p.type === "product" && p.stockQuantity !== undefined && (p.stockQuantity ?? 0) <= (p.minimumStock ?? 0));
      if (lowStock.length > 0) tips.push(`${lowStock.length} product${lowStock.length === 1 ? "" : "s"} ${lowStock.length === 1 ? "is" : "are"} at or below minimum stock — consider restocking.`);
      const sentQuotes = data.quotes.filter((q) => q.status === "sent");
      if (sentQuotes.length > 0) tips.push(`${sentQuotes.length} quote${sentQuotes.length === 1 ? "" : "s"} ${sentQuotes.length === 1 ? "hasn't" : "haven't"} been responded to — a nudge could convert them.`);
      if (tips.length === 0) tips.push("Everything looks healthy — no urgent follow-ups detected.");
      return tips.join("\n");
    },
  },
];

const EXAMPLES = [
  "Show overdue invoices",
  "Who paid today?",
  "How much profit this month?",
  "Show unpaid customers",
  "Generate monthly report",
  "Create business summary",
  "Recommend improvements",
];

export function answerBusinessQuery(query: string, data: BusinessQueryData): string {
  const q = query.toLowerCase();
  const handler = HANDLERS.find((h) => h.test(q));
  if (handler) return handler.answer(data);
  return `I can answer questions about your real business data. Try one of these:\n${EXAMPLES.map((e) => `• ${e}`).join("\n")}`;
}
