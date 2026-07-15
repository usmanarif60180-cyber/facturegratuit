import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { buildCalendarEvents } from "@/lib/utils/calendarEvents";
import type { BusinessTask, Expense, Invoice, Quote } from "@/types";

export function UpcomingWidget({
  invoices,
  quotes,
  tasks,
  expenses,
}: {
  invoices: Invoice[];
  quotes: Quote[];
  tasks: BusinessTask[];
  expenses: Expense[];
}) {
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const upcoming = buildCalendarEvents({ invoices, quotes, tasks, expenses })
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarDays className="h-4 w-4 text-primary" /> Upcoming
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing on the horizon.{" "}
            <Link href="/calendar" className="text-primary hover:underline">
              Open calendar
            </Link>
            .
          </p>
        ) : (
          upcoming.map((ev, i) => (
            <Link
              key={i}
              href={ev.href}
              className="flex items-center justify-between gap-2 rounded-md px-1.5 py-1 text-sm transition-colors hover:bg-muted"
            >
              <span className="min-w-0 flex-1 truncate">{ev.label}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {ev.date.toLocaleDateString("en", { month: "short", day: "numeric" })}
              </span>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
