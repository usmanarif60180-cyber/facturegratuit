import { formatCurrency, formatDate } from "@/lib/utils/format";

export function ReceiptPreview() {
  const items = [
    { description: "Consulting session — 2 hours", amount: 300 },
    { description: "Materials", amount: 45 },
  ];
  const total = items.reduce((s, i) => s + i.amount, 0);

  return (
    <div id="print-area" className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 shadow-card">
      <div className="text-center">
        <h2 className="text-lg font-bold">Your Business Name</h2>
        <p className="text-xs text-muted-foreground">123 Business Street, Your City</p>
      </div>
      <div className="my-5 flex items-center justify-between border-y border-border py-3 text-sm">
        <span className="text-muted-foreground">Receipt #</span>
        <span className="font-semibold">RCT-0001</span>
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Date</span>
        <span>{formatDate("2026-07-10T00:00:00.000Z")}</span>
      </div>
      <div className="mt-4 space-y-2 text-sm">
        {items.map((item) => (
          <div key={item.description} className="flex justify-between">
            <span>{item.description}</span>
            <span className="font-medium">{formatCurrency(item.amount, "USD")}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between border-t border-border pt-3 text-base font-bold">
        <span>Total paid</span>
        <span>{formatCurrency(total, "USD")}</span>
      </div>
      <p className="mt-6 text-center text-xs font-semibold uppercase tracking-wide text-success">
        Paid in full
      </p>
      <p className="mt-4 text-center text-xs text-muted-foreground">Thank you for your business.</p>
    </div>
  );
}
