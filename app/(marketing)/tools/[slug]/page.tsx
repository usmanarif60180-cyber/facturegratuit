import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import { TOOLS, getToolBySlug } from "@/config/tools";
import { buttonVariants } from "@/components/ui/Button";

import { TaxCalculator } from "@/components/tools/TaxCalculator";
import { ProfitMarginCalculator } from "@/components/tools/ProfitMarginCalculator";
import { InvoiceDueDateCalculator } from "@/components/tools/InvoiceDueDateCalculator";
import { LatePaymentInterestCalculator } from "@/components/tools/LatePaymentInterestCalculator";
import { NumberGenerator } from "@/components/tools/NumberGenerator";
import { CurrencyConverter } from "@/components/tools/CurrencyConverter";
import { QrCodeGenerator } from "@/components/tools/QrCodeGenerator";
import { BusinessNameGenerator } from "@/components/tools/BusinessNameGenerator";
import { BusinessExpenseCalculator } from "@/components/tools/BusinessExpenseCalculator";

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return buildMetadata({ title: "Tool not found", description: "", path: `/tools/${slug}`, noIndex: true });
  return buildMetadata({ title: tool.title, description: tool.description, path: `/tools/${tool.slug}` });
}

const FAQS: Record<string, { question: string; answer: string }[]> = {
  "tax-calculator": [
    { question: "Does this work for VAT, GST and sales tax?", answer: "Yes — enter whichever rate applies to you. The math for adding or extracting a percentage-based tax is the same regardless of what it's called locally." },
  ],
  "currency-converter": [
    { question: "How current are the exchange rates?", answer: "Rates are fetched live from a public exchange rate service and are suitable for estimates. For invoicing, always confirm the rate with your payment provider or bank." },
  ],
};

function renderTool(slug: string) {
  switch (slug) {
    case "tax-calculator": return <TaxCalculator />;
    case "profit-margin-calculator": return <ProfitMarginCalculator />;
    case "invoice-due-date-calculator": return <InvoiceDueDateCalculator />;
    case "late-payment-interest-calculator": return <LatePaymentInterestCalculator />;
    case "invoice-number-generator": return <NumberGenerator defaultPrefix="INV-" />;
    case "quote-number-generator": return <NumberGenerator defaultPrefix="QUO-" />;
    case "currency-converter": return <CurrencyConverter />;
    case "qr-code-generator": return <QrCodeGenerator />;
    case "business-name-generator": return <BusinessNameGenerator />;
    case "business-expense-calculator": return <BusinessExpenseCalculator />;
    default: return null;
  }
}

export default async function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const otherTools = TOOLS.filter((t) => t.slug !== tool.slug).slice(0, 4);
  const faqs = FAQS[tool.slug];

  return (
    <div className="container max-w-3xl py-14">
      {faqs && <JsonLd data={faqSchema(faqs)} />}
      <Breadcrumbs items={[{ name: "Free Tools", path: "/tools" }, { name: tool.shortTitle, path: `/tools/${tool.slug}` }]} />

      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{tool.title}</h1>
      <p className="mt-2 text-muted-foreground">{tool.description}</p>

      <div className="mt-8">{renderTool(tool.slug)}</div>

      {faqs && (
        <div className="mt-10 space-y-4">
          <h2 className="text-lg font-bold">Frequently asked questions</h2>
          {faqs.map((f) => (
            <div key={f.question}>
              <p className="text-sm font-semibold">{f.question}</p>
              <p className="mt-1 text-sm text-muted-foreground">{f.answer}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 rounded-lg border border-border bg-surface p-5">
        <p className="text-sm font-medium">Want this built into your invoices automatically?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          IVOXA calculates tax, totals and due dates for you — no separate tools needed.
        </p>
        <Link href="/register" className={buttonVariants({ size: "sm", className: "mt-3" })}>
          Start free
        </Link>
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="mb-4 text-lg font-bold">More free tools</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {otherTools.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="rounded-lg border border-border p-3 text-sm font-medium hover:border-primary hover:bg-primary/5"
            >
              {t.shortTitle}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
