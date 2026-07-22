import type { BusinessTask, Expense, Invoice, Quote } from "@/types";

export type CalendarEventKind = "invoice_due" | "quote_expiry" | "task" | "expense_due";

export interface CalendarEvent {
  date: Date;
  kind: CalendarEventKind;
  label: string;
  href: string;
}

/** Shared event aggregation used by both the Calendar page and the
 * dashboard's "Upcoming" widget, so the two never drift apart. */
export function buildCalendarEvents(data: {
  invoices: Invoice[];
  quotes: Quote[];
  tasks: BusinessTask[];
  expenses: Expense[];
}): CalendarEvent[] {
  const list: CalendarEvent[] = [];
  for (const inv of data.invoices) {
    if (inv.status === "paid" || inv.status === "canceled") continue;
    list.push({ date: new Date(inv.dueDate), kind: "invoice_due", label: `${inv.number} due`, href: `/invoices/${inv.id}` });
  }
  for (const q of data.quotes) {
    if (q.status === "accepted" || q.status === "declined" || q.status === "converted") continue;
    list.push({ date: new Date(q.expiryDate), kind: "quote_expiry", label: `${q.number} expires`, href: `/quotes/${q.id}` });
  }
  for (const t of data.tasks) {
    if (t.status === "done" || !t.dueDate) continue;
    list.push({ date: new Date(t.dueDate), kind: "task", label: t.title, href: "/tasks" });
  }
  for (const e of data.expenses) {
    if (!e.recurring?.nextDate) continue;
    list.push({ date: new Date(e.recurring.nextDate), kind: "expense_due", label: `${e.title} recurs`, href: "/expenses" });
  }
  return list;
}
