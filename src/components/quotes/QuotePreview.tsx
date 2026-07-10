import { QuoteStatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Client, Organization, Quote } from "@/types";

interface QuotePreviewProps {
  quote: Quote;
  client: Client | null;
  organization: Organization | null;
}

export function QuotePreview({ quote, client, organization }: QuotePreviewProps) {
  return (
    <div id="print-area" className="rounded-xl border border-border bg-card p-8 shadow-card sm:p-12">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
        <div>
          {organization?.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={organization.logoUrl} alt={organization.name} className="mb-3 h-10" />
          ) : (
            <h2 className="text-xl font-bold">{organization?.name ?? "Your Business"}</h2>
          )}
          <p className="text-sm text-muted-foreground">{organization?.email}</p>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold tracking-tight">Quote</h1>
          <p className="text-sm text-muted-foreground">{quote.number}</p>
          <div className="mt-2">
            <QuoteStatusBadge status={quote.status} />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">For</p>
          <p className="mt-1 font-medium">{client?.displayName ?? "—"}</p>
          <p className="text-sm text-muted-foreground">{client?.email}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Issue date
          </p>
          <p className="mt-1">{formatDate(quote.issueDate)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Valid until
          </p>
          <p className="mt-1">{formatDate(quote.expiryDate)}</p>
        </div>
      </div>

      <table className="mt-8 w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="pb-2">Description</th>
            <th className="pb-2 text-right">Qty</th>
            <th className="pb-2 text-right">Unit price</th>
            <th className="pb-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {quote.lineItems.map((item) => (
            <tr key={item.id}>
              <td className="py-2.5">{item.description || "—"}</td>
              <td className="py-2.5 text-right">{item.quantity}</td>
              <td className="py-2.5 text-right">{formatCurrency(item.unitPrice, quote.currency)}</td>
              <td className="py-2.5 text-right font-medium">
                {formatCurrency(item.quantity * item.unitPrice, quote.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ml-auto mt-6 flex w-full max-w-xs flex-col gap-1.5 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatCurrency(quote.totals.subtotal, quote.currency)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Discount</span>
          <span>-{formatCurrency(quote.totals.discountTotal, quote.currency)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Tax</span>
          <span>{formatCurrency(quote.totals.taxTotal, quote.currency)}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-1.5 text-base font-semibold">
          <span>Total</span>
          <span>{formatCurrency(quote.totals.total, quote.currency)}</span>
        </div>
      </div>

      {(quote.notes || quote.terms) && (
        <div className="mt-10 grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
          {quote.notes && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Notes
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{quote.notes}</p>
            </div>
          )}
          {quote.terms && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Terms
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{quote.terms}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
