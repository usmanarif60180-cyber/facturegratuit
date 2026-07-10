import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/seo/schema";
import { cn } from "@/lib/utils/cn";
import type { LandingContent } from "@/types/landing";

export function LandingTemplate({ content }: { content: LandingContent }) {
  return (
    <div className="container max-w-4xl py-14">
      {content.faqs && <JsonLd data={faqSchema(content.faqs)} />}
      <Breadcrumbs items={[{ name: content.eyebrow, path: content.path }]} />

      <span className="inline-block rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
        {content.eyebrow}
      </span>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{content.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{content.description}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={content.primaryCtaHref} className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
          {content.primaryCtaLabel} <ArrowRight className="h-4 w-4" />
        </Link>
        {content.secondaryCtaHref && content.secondaryCtaLabel && (
          <Link href={content.secondaryCtaHref} className={buttonVariants({ variant: "outline", size: "lg" })}>
            {content.secondaryCtaLabel}
          </Link>
        )}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {content.features.map((feature) => (
          <Card key={feature.title}>
            <CardContent className="pt-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-4.5 w-4.5" />
              </div>
              <p className="text-sm font-semibold">{feature.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {content.faqs && (
        <div className="mt-14 space-y-5">
          <h2 className="text-xl font-bold tracking-tight">Frequently asked questions</h2>
          {content.faqs.map((faq) => (
            <div key={faq.question}>
              <p className="text-sm font-semibold">{faq.question}</p>
              <p className="mt-1 text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-14 rounded-xl border border-border bg-surface p-6 text-center">
        <p className="text-lg font-bold">Ready to try it yourself?</p>
        <p className="mt-1 text-sm text-muted-foreground">Free to start — no credit card required.</p>
        <Link href={content.primaryCtaHref} className={cn(buttonVariants(), "mt-4 gap-2")}>
          {content.primaryCtaLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
