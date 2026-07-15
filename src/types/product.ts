import type { CurrencyCode, Timestamps } from "./common";

export type ProductType = "product" | "service";

export interface Product extends Timestamps {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  type: ProductType;
  sku?: string;
  barcode?: string;
  category?: string;
  unit?: string;
  unitPrice: number;
  /** Cost price — used for margin reporting. Only meaningful for type "product". */
  purchasePrice?: number;
  currency: CurrencyCode;
  defaultTaxRateId?: string;
  /** Inventory tracking is opt-in per product — undefined means "not tracked". */
  stockQuantity?: number;
  minimumStock?: number;
  supplier?: string;
  archived?: boolean;
}
