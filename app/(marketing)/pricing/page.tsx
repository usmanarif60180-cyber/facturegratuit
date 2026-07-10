import Link from "next/link";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PLANS } from "@/config/plans";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <div className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">Simple, transparent pricing</h1>
        <p className="mt-4 text-muted-foreground">
          Start free today. Upgrade only when your business needs more.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={cn("flex flex-col", plan.highlighted && "border-primary shadow-elevated")}
          >
            <CardHeader>
              {plan.highlighted && (
                <Badge variant="primary" className="mb-2 w-fit">
                  Most popular
                </Badge>
              )}
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <CardDescription>{plan.tagline}</CardDescription>
              <p className="pt-2 text-3xl font-bold">
                ${plan.price.monthly}
                <span className="text-sm font-normal text-muted-foreground">/mo</span>
              </p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <ul className="flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={buttonVariants({ variant: plan.highlighted ? "primary" : "outline" })}
              >
                {plan.id === "free" ? "Get started free" : "Coming soon"}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        IVOXA is currently free for everyone. Paid tiers above reflect our planned roadmap.
      </p>
    </div>
  );
}
