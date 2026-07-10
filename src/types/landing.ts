import type { LucideIcon } from "lucide-react";

export interface LandingFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface LandingFaq {
  question: string;
  answer: string;
}

export interface LandingContent {
  slug: string;
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  features: LandingFeature[];
  faqs?: LandingFaq[];
}
