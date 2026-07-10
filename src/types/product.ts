import type { CurrencyCode, Timestamps } from "./common";

export type ProductType = "product" | "service";

export interface Product extends Timestamps {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  type: ProductType;
  sku?: string;
  category?: string;
  unitPrice: number;
  currency: CurrencyCode;
  defaultTaxRateId?: string;
  archived?: boolean;
}
