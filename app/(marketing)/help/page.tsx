import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { HelpSearch } from "@/components/help/HelpSearch";
import { buildMetadata } from "@/lib/seo/metadata";
import { HELP_ARTICLES, getHelpCategories } from "@/lib/content/help/articles";

export const metadata: Metadata = buildMetadata({
  title: "Help Center",
  description: "Step-by-step guides, tax basics and troubleshooting for getting the most out of IVOXA.",
  path: "/help",
});

export default function HelpPage() {
  const categories = getHelpCategories();

  return (
    <div className="container py-14">
      <Breadcrumbs items={[{ name: "Help Center", path: "/help" }]} />
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Help Center</h1>
        <p className="mt-3 text-muted-foreground">
          Step-by-step guides for getting the most out of IVOXA. Can&apos;t find what you need?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact us
          </Link>
          .
        </p>
      </div>

      <div className="mt-8 max-w-md">
        <HelpSearch articles={HELP_ARTICLES} />
      </div>

      <div className="mt-10 space-y-10">
        {categories.map((category) => (
          <div key={category}>
            <h2 className="mb-3 text-lg font-bold tracking-tight">{category}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {HELP_ARTICLES.filter((a) => a.category === category).map((article) => (
                <Link
                  key={article.slug}
                  href={`/help/${article.slug}`}
                  className="rounded-lg border border-border p-4 transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <p className="text-sm font-semibold">{article.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{article.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
