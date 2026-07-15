"use client";

import * as React from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { productService } from "@/lib/services/productService";
import { CURRENCIES } from "@/lib/constants/currencies";
import type { Product, ProductType } from "@/types";

interface ProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  organizationId: string;
  defaultCurrency: string;
  product?: Product | null;
}

export function ProductFormDialog({
  open,
  onClose,
  organizationId,
  defaultCurrency,
  product,
}: ProductFormDialogProps) {
  const { toast } = useToast();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [type, setType] = React.useState<ProductType>("service");
  const [sku, setSku] = React.useState("");
  const [barcode, setBarcode] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [unit, setUnit] = React.useState("");
  const [unitPrice, setUnitPrice] = React.useState(0);
  const [purchasePrice, setPurchasePrice] = React.useState<number | "">("");
  const [currency, setCurrency] = React.useState(defaultCurrency);
  const [stockQuantity, setStockQuantity] = React.useState<number | "">("");
  const [minimumStock, setMinimumStock] = React.useState<number | "">("");
  const [supplier, setSupplier] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description ?? "");
      setType(product.type);
      setSku(product.sku ?? "");
      setBarcode(product.barcode ?? "");
      setCategory(product.category ?? "");
      setUnit(product.unit ?? "");
      setUnitPrice(product.unitPrice);
      setPurchasePrice(product.purchasePrice ?? "");
      setCurrency(product.currency);
      setStockQuantity(product.stockQuantity ?? "");
      setMinimumStock(product.minimumStock ?? "");
      setSupplier(product.supplier ?? "");
    } else {
      setName("");
      setDescription("");
      setType("service");
      setSku("");
      setBarcode("");
      setCategory("");
      setUnit("");
      setUnitPrice(0);
      setPurchasePrice("");
      setCurrency(defaultCurrency);
      setStockQuantity("");
      setMinimumStock("");
      setSupplier("");
    }
  }, [product, open, defaultCurrency]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name,
        description: description || undefined,
        type,
        sku: sku || undefined,
        barcode: barcode || undefined,
        category: category || undefined,
        unit: unit || undefined,
        unitPrice,
        purchasePrice: purchasePrice === "" ? undefined : purchasePrice,
        currency,
        stockQuantity: type === "product" && stockQuantity !== "" ? stockQuantity : undefined,
        minimumStock: type === "product" && minimumStock !== "" ? minimumStock : undefined,
        supplier: supplier || undefined,
      };
      if (product) {
        await productService.update(organizationId, product.id, payload);
        toast({ variant: "success", title: "Product updated" });
      } else {
        await productService.create(organizationId, payload);
        toast({ variant: "success", title: "Product added" });
      }
      onClose();
    } catch {
      toast({ variant: "error", title: "Couldn't save product", description: "Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={product ? "Edit product" : "Add product"}
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="type">Type</Label>
            <Select id="type" value={type} onChange={(e) => setType(e.target.value as ProductType)}>
              <option value="service">Service</option>
              <option value="product">Product</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="unitPrice">Selling price</Label>
            <Input
              id="unitPrice"
              type="number"
              min={0}
              step="any"
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="purchasePrice">Purchase price</Label>
            <Input
              id="purchasePrice"
              type="number"
              min={0}
              step="any"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </div>
        </div>

        {type === "product" && (
          <div className="space-y-4 rounded-md border border-border p-3.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Inventory</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="barcode">Barcode</Label>
                <Input id="barcode" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Input id="unit" placeholder="pcs, kg, box…" value={unit} onChange={(e) => setUnit(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="stockQuantity">Stock quantity</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  min={0}
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="minimumStock">Minimum stock</Label>
                <Input
                  id="minimumStock"
                  type="number"
                  min={0}
                  value={minimumStock}
                  onChange={(e) => setMinimumStock(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input id="supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {product ? "Save changes" : "Add product"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
