"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useInvoices } from "@/hooks/useInvoices";
import { useQuotes } from "@/hooks/useQuotes";
import { useTasks } from "@/hooks/useTasks";
import { useExpenses } from "@/hooks/useExpenses";
import { buildCalendarEvents, type CalendarEvent as BaseCalendarEvent, type CalendarEventKind } from "@/lib/utils/calendarEvents";
import { cn } from "@/lib/utils/cn";

type EventKind = CalendarEventKind | "tax";

interface CalendarEvent {
  date: Date;
  kind: EventKind;
  label: string;
}

function withTaxKind(events: BaseCalendarEvent[]): CalendarEvent[] {
  return events.map((e) => ({ date: e.date, kind: e.kind, label: e.label }));
}

const KIND_META: Record<EventKind, { label: string; className: string }> = {
  invoice_due: { label: "Invoice due", className: "bg-danger" },
  quote_expiry: { label: "Quote expiry", className: "bg-warning" },
  task: { label: "Task", className: "bg-primary" },
  expense_due: { label: "Recurring expense", className: "bg-info" },
  tax: { label: "Tax date", className: "bg-secondary" },
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function taxDatesFor(year: number): CalendarEvent[] {
  // General guidance only — quarterly estimated-tax style markers, not
  // jurisdiction-specific advice. Verify actual deadlines locally.
  return [0, 3, 6, 9].map((month) => ({
    date: new Date(year, month, 15),
    kind: "tax" as const,
    label: "Estimated quarterly tax date",
  }));
}

export default function CalendarPage() {
  const { items: invoices } = useInvoices();
  const { items: quotes } = useQuotes();
  const { items: tasks } = useTasks();
  const { items: expenses } = useExpenses();

  const [cursor, setCursor] = React.useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const events = React.useMemo<CalendarEvent[]>(() => {
    const list = withTaxKind(buildCalendarEvents({ invoices, quotes, tasks, expenses }));
    list.push(...taxDatesFor(cursor.getFullYear()));
    return list;
  }, [invoices, quotes, tasks, expenses, cursor]);

  const monthLabel = cursor.toLocaleString("en", { month: "long", year: "numeric" });
  const firstOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1)),
  ];

  const eventsByDay = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      if (ev.date.getMonth() !== cursor.getMonth() || ev.date.getFullYear() !== cursor.getFullYear()) continue;
      const key = ev.date.getDate();
      const list = map.get(String(key)) ?? [];
      list.push(ev);
      map.set(String(key), list);
    }
    return map;
  }, [events, cursor]);

  const today = new Date();
  const upcoming = events
    .filter((e) => e.date >= new Date(today.getFullYear(), today.getMonth(), today.getDate()))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 8);

  return (
    <div>
      <PageHeader
        title="Calendar"
        description="Invoices due, quote expiries, tasks and deadlines in one view."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} aria-label="Previous month">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="w-36 text-center text-sm font-medium">{monthLabel}</span>
            <Button variant="outline" size="icon" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} aria-label="Next month">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr,20rem]">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
              {WEEKDAYS.map((d) => (
                <div key={d} className="pb-2">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((date, i) => {
                if (!date) return <div key={i} className="aspect-square" />;
                const isToday = date.toDateString() === today.toDateString();
                const dayEvents = eventsByDay.get(String(date.getDate())) ?? [];
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex aspect-square flex-col items-center gap-1 rounded-md border border-transparent p-1 text-xs",
                      isToday && "border-primary bg-primary/5 font-semibold"
                    )}
                  >
                    <span>{date.getDate()}</span>
                    <div className="flex flex-wrap justify-center gap-0.5">
                      {dayEvents.slice(0, 4).map((ev, idx) => (
                        <span key={idx} className={cn("h-1.5 w-1.5 rounded-full", KIND_META[ev.kind].className)} title={ev.label} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
              {(Object.keys(KIND_META) as EventKind[]).map((k) => (
                <span key={k} className="flex items-center gap-1.5">
                  <span className={cn("h-2 w-2 rounded-full", KIND_META[k].className)} />
                  {KIND_META[k].label}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 pt-6">
            <p className="text-sm font-semibold">Upcoming</p>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing coming up.</p>
            ) : (
              upcoming.map((ev, i) => (
                <div key={i} className="flex items-start justify-between gap-2 border-b border-border pb-2.5 text-sm last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{ev.label}</p>
                    <p className="text-xs text-muted-foreground">{ev.date.toLocaleDateString("en", { month: "short", day: "numeric" })}</p>
                  </div>
                  <Badge className={cn("shrink-0 text-white", KIND_META[ev.kind].className)}>{KIND_META[ev.kind].label}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
