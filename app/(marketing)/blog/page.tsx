import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { NewsletterSignup } from "@/components/marketing/NewsletterSignup";
import { BLOG_POSTS } from "@/lib/content/blog/posts";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Practical guides on invoicing, quotes, taxes, accounting and running a small business — from the team building IVOXA.",
  path: "/blog",
});

export default function BlogIndexPage() {
  const sorted = [...BLOG_POSTS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  return (
    <div className="container py-14">
      <Breadcrumbs items={[{ name: "Blog", path: "/blog" }]} />
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">The IVOXA Blog</h1>
        <p className="mt-3 text-muted-foreground">
          Practical, no-fluff guides on invoicing, quotes, taxes, accounting and running a small
          business.
        </p>
      </div>

      <div className="mt-10">
        <BlogExplorer posts={sorted} />
      </div>

      <div className="mt-14 max-w-xl">
        <NewsletterSignup source="blog-index" />
      </div>
    </div>
  );
}
