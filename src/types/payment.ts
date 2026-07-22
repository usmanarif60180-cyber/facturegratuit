import type { CurrencyCode, Timestamps } from "./common";

export type PaymentMethod = "bank_transfer" | "card" | "cash" | "paypal" | "check" | "other";

export interface Payment extends Timestamps {
  id: string;
  organizationId: string;
  invoiceId: string;
  clientId: string;
  amount: number;
  currency: CurrencyCode;
  method: PaymentMethod;
  date: string;
  note?: string;
}
