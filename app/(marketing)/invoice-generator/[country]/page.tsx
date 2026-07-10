import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, Check } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Card, CardContent } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo/metadata";
import { COUNTRY_GUIDES, getCountryGuide } from "@/lib/content/countries/guides";

export function generateStaticParams() {
  return COUNTRY_GUIDES.map((c) => ({ country: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params;
  const guide = getCountryGuide(country);
  if (!guide) return buildMetadata({ title: "Not found", description: "", path: `/invoice-generator/${country}`, noIndex: true });
  return buildMetadata({
    title: `Free Invoice Generator for ${guide.name}`,
    description: `Create invoices for ${guide.name} — ${guide.taxName}, currency, invoicing rules and best practices, plus a free invoice generator.`,
    path: `/invoice-generator/${guide.slug}`,
  });
}

export default async function CountryInvoiceGeneratorPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const guide = getCountryGuide(country);
  if (!guide) notFound();

  return (
    <div className="container max-w-3xl py-14">
      <Breadcrumbs items={[{ name: "Invoice Generator", path: "/invoice-generator" }, { name: guide.name, path: `/invoice-generator/${guide.slug}` }]} />

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Free Invoice Generator for {guide.name}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">{guide.intro}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/register" className={buttonVariants()}>Create a {guide.name} invoice — free</Link>
        <Link href="/resources/invoice-template" className={buttonVariants({ variant: "outline" })}>View invoice template</Link>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Currency</p>
            <p className="mt-1 text-lg font-bold">{guide.currency} ({guide.currencySymbol})</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Consumption tax</p>
            <p className="mt-1 text-lg font-bold">{guide.taxName}</p>
          </CardContent>
        </Card>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">{guide.taxOverview}</p>

      <section className="mt-10">
        <h2 className="text-xl font-bold tracking-tight">Business requirements</h2>
        <ul className="mt-3 space-y-2">
          {guide.requirements.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold tracking-tight">What a compliant invoice needs</h2>
        <ul className="mt-3 space-y-2">
          {guide.invoiceRules.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold tracking-tight">Best practices</h2>
        <ul className="mt-3 space-y-2">
          {guide.bestPractices.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10 flex gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4 text-sm">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <p className="text-foreground/90">{guide.legalNote}</p>
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="mb-4 text-lg font-bold">Other countries</h2>
        <div className="flex flex-wrap gap-2">
          {COUNTRY_GUIDES.filter((c) => c.slug !== guide.slug).map((c) => (
            <Link
              key={c.slug}
              href={`/invoice-generator/${c.slug}`}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
