import type { SubscriptionPlan } from "@/types";

export interface PlanDefinition {
  id: SubscriptionPlan;
  name: string;
  price: { monthly: number; yearly: number };
  tagline: string;
  features: string[];
  highlighted?: boolean;
}

/** V1 is Free-only in practice; the other tiers are defined so pricing UI and
 * billing logic never need a rewrite when paid plans launch. */
export const PLANS: PlanDefinition[] = [
  {
    id: "free",
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    tagline: "Everything you need to get started",
    features: [
      "20 invoices / month",
      "20 quotes / month",
      "Unlimited clients & products",
      "500 MB storage",
      "1 team member",
      "Core AI credits",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: { monthly: 9, yearly: 90 },
    tagline: "For freelancers going full-time",
    features: [
      "Unlimited invoices & quotes",
      "5 GB storage",
      "3 team members",
      "Premium templates",
      "Priority AI credits",
    ],
    highlighted: true,
  },
  {
    id: "professional",
    name: "Professional",
    price: { monthly: 29, yearly: 290 },
    tagline: "For growing agencies and consultancies",
    features: [
      "Everything in Starter",
      "50 GB storage",
      "10 team members",
      "API access",
      "Advanced reports",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: { monthly: 79, yearly: 790 },
    tagline: "For established teams",
    features: [
      "Everything in Professional",
      "500 GB storage",
      "Unlimited team members",
      "Dedicated support",
    ],
  },
];
