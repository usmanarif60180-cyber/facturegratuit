import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Card, CardContent } from "@/components/ui/Card";
import { NewsletterSignup } from "@/components/marketing/NewsletterSignup";
import { buildMetadata } from "@/lib/seo/metadata";
import { RESOURCE_ITEMS } from "@/lib/content/resources/items";

export const metadata: Metadata = buildMetadata({
  title: "Free Business Resources & Templates",
  description:
    "Free invoice templates, quote templates, receipts, purchase orders and business checklists — ready to use or customize in IVOXA.",
  path: "/resources",
});

export default function ResourcesPage() {
  const categories = Array.from(new Set(RESOURCE_ITEMS.map((r) => r.category)));

  return (
    <div className="container py-14">
      <Breadcrumbs items={[{ name: "Resources", path: "/resources" }]} />
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Free Business Resources</h1>
        <p className="mt-3 text-muted-foreground">
          Templates, examples and checklists you can use right away — print them, save them as a PDF,
          or build them directly in IVOXA.
        </p>
      </div>

      <div className="mt-10 space-y-10">
        {categories.map((category) => (
          <div key={category}>
            <h2 className="mb-3 text-lg font-bold tracking-tight">{category}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {RESOURCE_ITEMS.filter((r) => r.category === category).map((resource) => (
                <Link key={resource.slug} href={`/resources/${resource.slug}`}>
                  <Card hoverable className="h-full">
                    <CardContent className="pt-6">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="h-4.5 w-4.5" />
                      </div>
                      <p className="text-sm font-semibold">{resource.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{resource.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 max-w-xl">
        <NewsletterSignup source="resources-index" title="New templates, in your inbox" description="We'll let you know when we add new resources." />
      </div>
    </div>
  );
}
