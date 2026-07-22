import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Card, CardContent } from "@/components/ui/Card";
import { PromoBanner } from "@/components/marketing/PromoBanner";
import { buildMetadata } from "@/lib/seo/metadata";
import { TOOLS } from "@/config/tools";

export const metadata: Metadata = buildMetadata({
  title: "Free Business Tools",
  description:
    "Free calculators and generators for invoicing, tax and everyday business math — no signup required.",
  path: "/tools",
});

export default function ToolsPage() {
  const categories = Array.from(new Set(TOOLS.map((t) => t.category)));

  return (
    <div className="container py-14">
      <Breadcrumbs items={[{ name: "Free Tools", path: "/tools" }]} />
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Free Business Tools</h1>
        <p className="mt-3 text-muted-foreground">
          Quick calculators and generators for the everyday business math — free, no signup required.
        </p>
      </div>

      <div className="mt-10 space-y-10">
        {categories.map((category) => (
          <div key={category}>
            <h2 className="mb-3 text-lg font-bold tracking-tight">{category}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TOOLS.filter((t) => t.category === category).map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`}>
                  <Card hoverable className="h-full">
                    <CardContent className="pt-6">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <tool.icon className="h-4.5 w-4.5" />
                      </div>
                      <p className="text-sm font-semibold">{tool.shortTitle}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14">
        <PromoBanner
          icon={Sparkles}
          eyebrow="Beyond calculators"
          title="Skip the manual math — send the invoice"
          description="IVOXA calculates tax, totals and due dates automatically as part of every invoice and quote."
          ctaLabel="Start free"
          ctaHref="/register"
        />
      </div>
    </div>
  );
}
