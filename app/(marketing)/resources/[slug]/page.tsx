import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ContentRenderer } from "@/components/blog/ContentRenderer";
import { InvoicePreview } from "@/components/invoices/InvoicePreview";
import { QuotePreview } from "@/components/quotes/QuotePreview";
import { ReceiptPreview } from "@/components/resources/ReceiptPreview";
import { PurchaseOrderPreview } from "@/components/resources/PurchaseOrderPreview";
import { PrintButton } from "@/components/resources/PrintButton";
import { AdSlot } from "@/components/marketing/AdSlot";
import { buttonVariants } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo/metadata";
import { RESOURCE_ITEMS, getResourceBySlug } from "@/lib/content/resources/items";
import {
  BLANK_CLIENT,
  BLANK_INVOICE,
  BLANK_ORGANIZATION,
  BLANK_QUOTE,
  EXAMPLE_CLIENT,
  EXAMPLE_INVOICE,
  EXAMPLE_ORGANIZATION,
  EXAMPLE_QUOTE,
} from "@/lib/content/resources/samples";

export function generateStaticParams() {
  return RESOURCE_ITEMS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) return buildMetadata({ title: "Resource not found", description: "", path: `/resources/${slug}`, noIndex: true });
  return buildMetadata({ title: resource.title, description: resource.description, path: `/resources/${resource.slug}` });
}

export default async function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) notFound();

  const isExample = resource.variant === "example";

  return (
    <div className="container max-w-3xl py-14">
      <Breadcrumbs items={[{ name: "Resources", path: "/resources" }, { name: resource.title, path: `/resources/${resource.slug}` }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{resource.title}</h1>
          <p className="mt-2 text-muted-foreground">{resource.description}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <PrintButton />
          <Link href="/register" className={buttonVariants()}>
            Use in IVOXA
          </Link>
        </div>
      </div>

      <div className="mt-8">
        {resource.kind === "invoice" && (
          <InvoicePreview
            invoice={isExample ? EXAMPLE_INVOICE : BLANK_INVOICE}
            client={isExample ? EXAMPLE_CLIENT : BLANK_CLIENT}
            organization={isExample ? EXAMPLE_ORGANIZATION : BLANK_ORGANIZATION}
          />
        )}
        {resource.kind === "quote" && (
          <QuotePreview
            quote={isExample ? EXAMPLE_QUOTE : BLANK_QUOTE}
            client={isExample ? EXAMPLE_CLIENT : BLANK_CLIENT}
            organization={isExample ? EXAMPLE_ORGANIZATION : BLANK_ORGANIZATION}
          />
        )}
        {resource.kind === "receipt" && <ReceiptPreview />}
        {resource.kind === "purchase-order" && <PurchaseOrderPreview />}
        {resource.kind === "checklist" && resource.content && (
          <div className="rounded-xl border border-border bg-card p-6" id="print-area">
            <ContentRenderer blocks={resource.content} />
          </div>
        )}
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Want this filled in automatically, with your branding, saved clients and live totals?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Start free in IVOXA
        </Link>
        .
      </p>

      <AdSlot label="In-page advertisement" className="mt-8" />
    </div>
  );
}
