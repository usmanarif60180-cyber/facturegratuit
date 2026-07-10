import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { InvoiceStatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { History } from "lucide-react";
import type { Invoice } from "@/types";

export function RecentActivity({ invoices }: { invoices: Invoice[] }) {
  const recent = invoices.slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <EmptyState
            icon={<History className="h-5 w-5" />}
            title="No activity yet"
            description="Your recent invoices will show up here."
          />
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((invoice) => (
              <li key={invoice.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{invoice.number}</p>
                  <p className="text-muted-foreground">{formatDate(invoice.issueDate)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">
                    {formatCurrency(invoice.totals.total, invoice.currency)}
                  </span>
                  <InvoiceStatusBadge status={invoice.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
