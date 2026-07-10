import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ContentRenderer } from "@/components/blog/ContentRenderer";
import { AdSlot } from "@/components/marketing/AdSlot";
import { buildMetadata } from "@/lib/seo/metadata";
import { HELP_ARTICLES, getHelpArticleBySlug } from "@/lib/content/help/articles";

export function generateStaticParams() {
  return HELP_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getHelpArticleBySlug(slug);
  if (!article) return buildMetadata({ title: "Article not found", description: "", path: `/help/${slug}`, noIndex: true });
  return buildMetadata({ title: article.title, description: article.description, path: `/help/${article.slug}` });
}

export default async function HelpArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getHelpArticleBySlug(slug);
  if (!article) notFound();

  return (
    <div className="container max-w-3xl py-14">
      <Breadcrumbs
        items={[
          { name: "Help Center", path: "/help" },
          { name: article.category, path: "/help" },
          { name: article.title, path: `/help/${article.slug}` },
        ]}
      />
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">{article.category}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">{article.title}</h1>
      <p className="mt-3 text-muted-foreground">{article.description}</p>

      <div className="mt-8">
        <ContentRenderer blocks={article.content} />
      </div>

      <div className="mt-12 rounded-lg border border-border bg-surface p-5 text-sm">
        <p className="font-medium">Still need help?</p>
        <p className="mt-1 text-muted-foreground">
          <Link href="/contact" className="text-primary hover:underline">
            Contact our team
          </Link>{" "}
          and we&apos;ll get back to you.
        </p>
      </div>

      <AdSlot label="In-article advertisement" className="mt-8" />
    </div>
  );
}
