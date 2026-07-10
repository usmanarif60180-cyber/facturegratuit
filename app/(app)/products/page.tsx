"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { MoreHorizontal, PackagePlus, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@/components/ui/Dropdown";
import { useToast } from "@/components/ui/Toast";
import { useProducts } from "@/hooks/useProducts";
import { useOrganization } from "@/hooks/useOrganization";
import { productService } from "@/lib/services/productService";
import { ProductFormDialog } from "@/components/products/ProductFormDialog";
import { formatCurrency } from "@/lib/utils/format";
import type { Product } from "@/types";

export default function ProductsPage() {
  const { items: products, loading, organizationId } = useProducts();
  const { organization } = useOrganization();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const [search, setSearch] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(searchParams.get("new") === "1");
  const [editing, setEditing] = React.useState<Product | null>(null);

  const filtered = products.filter(
    (p) => !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(product: Product) {
    if (!organizationId) return;
    await productService.remove(organizationId, product.id);
    toast({ variant: "success", title: "Product removed" });
  }

  return (
    <div>
      <PageHeader
        title="Products & Services"
        description="Reusable items you can add to invoices and quotes."
        action={
          <Button
            className="gap-2"
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <PackagePlus className="h-4 w-4" /> Add product
          </Button>
        }
      />

      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products…"
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="rounded-lg border border-border">
          <TableSkeleton />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          illustration="digital-workspace"
          title={products.length === 0 ? "No products yet" : "No products match your search"}
          action={
            products.length === 0 ? (
              <Button onClick={() => setDialogOpen(true)}>Add product</Button>
            ) : undefined
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge variant={product.type === "service" ? "info" : "default"}>
                    {product.type}
                  </Badge>
                </TableCell>
                <TableCell>{product.category ?? "—"}</TableCell>
                <TableCell>{product.sku ?? "—"}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(product.unitPrice, product.currency)}
                </TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="ghost" size="icon" aria-label="Product actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem
                        onSelect={() => {
                          setEditing(product);
                          setDialogOpen(true);
                        }}
                      >
                        Edit
                      </DropdownItem>
                      <DropdownItem onSelect={() => handleDelete(product)} className="text-danger">
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {organizationId && (
        <ProductFormDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          organizationId={organizationId}
          defaultCurrency={organization?.settings.defaultCurrency ?? "USD"}
          product={editing}
        />
      )}
    </div>
  );
}
