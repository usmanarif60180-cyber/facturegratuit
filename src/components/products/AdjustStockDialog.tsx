"use client";

import * as React from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { inventoryMovementService } from "@/lib/services/inventoryMovementService";
import type { InventoryMovementKind, Product } from "@/types";

interface AdjustStockDialogProps {
  open: boolean;
  onClose: () => void;
  organizationId: string;
  product: Product | null;
  onAdjusted: () => void;
}

const KINDS: { value: InventoryMovementKind; label: string }[] = [
  { value: "restock", label: "Restock (add)" },
  { value: "sale", label: "Sale (remove)" },
  { value: "return", label: "Return (add)" },
  { value: "adjustment", label: "Manual adjustment" },
];

export function AdjustStockDialog({ open, onClose, organizationId, product, onAdjusted }: AdjustStockDialogProps) {
  const { toast } = useToast();
  const [kind, setKind] = React.useState<InventoryMovementKind>("restock");
  const [quantity, setQuantity] = React.useState(1);
  const [note, setNote] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setKind("restock");
      setQuantity(1);
      setNote("");
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!product || quantity <= 0) return;
    setSaving(true);
    try {
      const signed = kind === "sale" ? -Math.abs(quantity) : Math.abs(quantity);
      await inventoryMovementService.recordMovement(organizationId, {
        productId: product.id,
        kind,
        quantityChange: signed,
        note: note || undefined,
      });
      toast({ variant: "success", title: "Stock updated" });
      onAdjusted();
      onClose();
    } catch {
      toast({ variant: "error", title: "Couldn't update stock", description: "Please try again." });
    } finally {
      setSaving(false);
    }
  }

  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose} title="Adjust stock" description={product.name}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <p className="text-sm text-muted-foreground">
          Current stock: <span className="font-medium text-foreground">{product.stockQuantity ?? 0}</span>
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="kind">Movement</Label>
            <Select id="kind" value={kind} onChange={(e) => setKind(e.target.value as InventoryMovementKind)}>
              {KINDS.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="note">Note</Label>
          <Textarea id="note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Save adjustment
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
