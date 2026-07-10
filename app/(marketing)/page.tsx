import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  FileSpreadsheet,
  Users,
  Sparkles,
  Globe2,
  ShieldCheck,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import { AudienceStrip } from "@/components/marketing/AudienceStrip";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { LatestArticles } from "@/components/marketing/LatestArticles";
import { FeaturedTemplates } from "@/components/marketing/FeaturedTemplates";
import { buildMetadata } from "@/lib/seo/metadata";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = buildMetadata({
  title: "IVOXA — The AI Business Platform",
  description:
    "IVOXA brings invoicing, quotations, clients and AI together — designed for freelancers, agencies and growing teams who want tools that feel effortless.",
  path: "/",
});

const FEATURES = [
  {
    icon: FileText,
    title: "Professional invoicing",
    description:
      "Beautiful, pixel-perfect invoices with multi-currency, multi-language and every tax system covered.",
  },
  {
    icon: FileSpreadsheet,
    title: "Quotes that convert",
    description: "Send polished quotations and turn accepted ones into invoices in a single click.",
  },
  {
    icon: Users,
    title: "Client & product hub",
    description: "Keep every client, product and service organized in one searchable workspace.",
  },
  {
    icon: Sparkles,
    title: "AI built in",
    description: "An AI assistant woven into the platform, ready to draft, summarize and automate.",
  },
  {
    icon: Globe2,
    title: "Built for the world",
    description: "Any country, currency, language or tax system — nothing is hardcoded.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise-grade security",
    description: "Firebase-backed authentication and strict, organization-scoped data access.",
  },
];

export default function LandingPage() {
  return (
    <>
      <section className="container flex flex-col items-center gap-6 py-24 text-center md:py-32">
        <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          The AI Business Platform
        </span>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Run your business on{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            one intelligent workspace
          </span>
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          IVOXA brings invoicing, quotations, clients and AI together — designed for freelancers,
          agencies and growing teams who want tools that feel effortless.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
            Get started free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/features" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Explore features
          </Link>
        </div>
      </section>

      <div className="container border-y border-border">
        <TrustStrip />
      </div>

      <section className="container py-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="animate-fade-in">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-20">
        <div className="container">
          <h2 className="text-center text-2xl font-bold tracking-tight">What people are saying</h2>
          <div className="mt-8">
            <TestimonialsSection />
          </div>
          <div className="mt-10">
            <AudienceStrip />
          </div>
        </div>
      </section>

      <section className="container py-20">
        <FeaturedTemplates />
      </section>

      <section className="container pb-20">
        <LatestArticles />
      </section>

      <section className="border-t border-border bg-muted/30 py-20">
        <div className="container flex flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Free to start. Built to grow with you.</h2>
          <p className="max-w-xl text-muted-foreground">
            Version 1 is completely free — every core tool, no credit card required.
          </p>
          <Link href="/register" className={buttonVariants({ size: "lg" })}>
            Create your workspace
          </Link>
        </div>
      </section>
    </>
  );
}
