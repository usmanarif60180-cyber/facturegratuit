import type { Timestamps } from "./common";

export type SubscriptionPlan = "free" | "starter" | "professional" | "business" | "enterprise";
export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | "expired";
export type BillingCycle = "monthly" | "yearly";

/**
 * Every organization owns exactly one of these. Version 1 ships Free-only;
 * the shape exists up front so upgrades never require a schema migration.
 */
export interface Subscription extends Timestamps {
  id: string;
  organizationId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  invoiceLimit: number | null; // null = unlimited
  quoteLimit: number | null;
  storageLimitBytes: number | null;
  teamLimit: number | null;
  aiCredits: number | null;
  premiumTemplates: boolean;
  apiAccess: boolean;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export const FREE_PLAN_DEFAULTS: Omit<Subscription, "id" | "organizationId" | "createdAt" | "updatedAt"> = {
  plan: "free",
  status: "active",
  billingCycle: "monthly",
  invoiceLimit: 20,
  quoteLimit: 20,
  storageLimitBytes: 500 * 1024 * 1024,
  teamLimit: 1,
  aiCredits: 20,
  premiumTemplates: false,
  apiAccess: false,
  cancelAtPeriodEnd: false,
};
