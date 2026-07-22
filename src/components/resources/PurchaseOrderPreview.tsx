import { formatCurrency, formatDate } from "@/lib/utils/format";

export function PurchaseOrderPreview() {
  const items = [
    { description: "Office chairs", quantity: 4, unitPrice: 220 },
    { description: "Standing desks", quantity: 2, unitPrice: 480 },
  ];
  const total = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);

  return (
    <div id="print-area" className="rounded-xl border border-border bg-card p-8 shadow-card sm:p-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-lg font-bold">Your Business Name</h2>
          <p className="text-sm text-muted-foreground">123 Business Street, Your City</p>
        </div>
        <div className="text-right">
          <h1 className="text-xl font-bold tracking-tight">Purchase Order</h1>
          <p className="text-sm text-muted-foreground">PO-0001</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vendor</p>
          <p className="mt-1 text-sm font-medium">Vendor Name</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order date</p>
          <p className="mt-1 text-sm">{formatDate("2026-07-10T00:00:00.000Z")}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Requested delivery</p>
          <p className="mt-1 text-sm">{formatDate("2026-07-24T00:00:00.000Z")}</p>
        </div>
      </div>

      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="pb-2">Description</th>
            <th className="pb-2 text-right">Qty</th>
            <th className="pb-2 text-right">Unit price</th>
            <th className="pb-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => (
            <tr key={item.description}>
              <td className="py-2.5">{item.description}</td>
              <td className="py-2.5 text-right">{item.quantity}</td>
              <td className="py-2.5 text-right">{formatCurrency(item.unitPrice, "USD")}</td>
              <td className="py-2.5 text-right font-medium">{formatCurrency(item.quantity * item.unitPrice, "USD")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ml-auto mt-4 w-full max-w-xs border-t border-border pt-2 text-right text-base font-bold">
        Total: {formatCurrency(total, "USD")}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">Authorized by: ______________________</p>
    </div>
  );
}
