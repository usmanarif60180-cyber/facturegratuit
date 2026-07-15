import Link from "next/link";
import { AlertTriangle, Boxes } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { Product } from "@/types";

export function InventoryAlertsWidget({ products }: { products: Product[] }) {
  const low = products.filter(
    (p) => p.type === "product" && p.stockQuantity !== undefined && (p.stockQuantity ?? 0) <= (p.minimumStock ?? 0)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Boxes className="h-4 w-4 text-primary" /> Inventory alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {low.length === 0 ? (
          <p className="text-sm text-muted-foreground">Stock levels look healthy.</p>
        ) : (
          low.slice(0, 5).map((p) => (
            <Link
              key={p.id}
              href="/products"
              className="flex items-center justify-between gap-2 rounded-md px-1.5 py-1 text-sm transition-colors hover:bg-muted"
            >
              <span className="min-w-0 flex-1 truncate">{p.name}</span>
              <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-danger">
                <AlertTriangle className="h-3 w-3" /> {p.stockQuantity} left
              </span>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
