import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Card, CardContent } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo/metadata";
import { COUNTRY_GUIDES } from "@/lib/content/countries/guides";

export const metadata: Metadata = buildMetadata({
  title: "Free Invoice Generator",
  description:
    "Create professional invoices online, free — any currency, any country, any tax system. No credit card required.",
  path: "/invoice-generator",
});

const HIGHLIGHTS = [
  "Professional templates with your logo and branding",
  "Any currency, language and tax system",
  "Sequential invoice numbering, handled automatically",
  "Print or save as PDF in one click",
  "Track draft, pending, paid and overdue status",
];

export default function InvoiceGeneratorHubPage() {
  return (
    <div className="container max-w-4xl py-14">
      <Breadcrumbs items={[{ name: "Invoice Generator", path: "/invoice-generator" }]} />

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Free Invoice Generator</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
        Create professional, client-ready invoices online — completely free. Pick your country
        below for local invoicing rules, or jump straight in.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/register" className={buttonVariants({ size: "lg", className: "gap-2" })}>
          Create your first invoice <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/resources/invoice-template" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Preview a template
        </Link>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {HIGHLIGHTS.map((item) => (
          <div key={item} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {item}
          </div>
        ))}
      </div>

      <div className="mt-14">
        <h2 className="text-xl font-bold tracking-tight">Invoicing by country</h2>
        <p className="mt-2 text-muted-foreground">
          Invoicing rules, tax systems and best practices differ by country. Pick yours for a
          tailored guide.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COUNTRY_GUIDES.map((country) => (
            <Link key={country.slug} href={`/invoice-generator/${country.slug}`}>
              <Card hoverable className="h-full">
                <CardContent className="pt-6">
                  <p className="text-sm font-semibold">{country.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {country.currency} · {country.taxName}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
