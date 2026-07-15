import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Payment, PaymentMethod } from "@/types";

const METHOD_LABELS: Record<PaymentMethod, string> = {
  bank_transfer: "Bank transfer",
  card: "Card",
  cash: "Cash",
  paypal: "PayPal",
  check: "Check",
  other: "Other",
};

export function PaymentHistory({ payments }: { payments: Payment[] }) {
  if (payments.length === 0) return null;

  return (
    <Card className="print:hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CreditCard className="h-4 w-4 text-primary" /> Payment history
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5 pt-0">
        {payments.map((p) => (
          <div key={p.id} className="flex items-center justify-between border-b border-border pb-2.5 text-sm last:border-0 last:pb-0">
            <div>
              <p className="font-medium">{formatCurrency(p.amount, p.currency)}</p>
              <p className="text-xs text-muted-foreground">
                {METHOD_LABELS[p.method]} · {formatDate(p.date)}
                {p.note ? ` · ${p.note}` : ""}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
