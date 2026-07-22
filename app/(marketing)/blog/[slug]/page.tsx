import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ContentRenderer } from "@/components/blog/ContentRenderer";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { BlogCard } from "@/components/blog/BlogCard";
import { NewsletterSignup } from "@/components/marketing/NewsletterSignup";
import { AdSlot } from "@/components/marketing/AdSlot";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleSchema } from "@/lib/seo/schema";
import { BLOG_POSTS, getPostBySlug, getRelatedPosts, estimateReadingMinutes, categorySlug } from "@/lib/content/blog/posts";
import { getAuthor } from "@/lib/content/blog/authors";
import { formatDate } from "@/lib/utils/format";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return buildMetadata({ title: "Article not found", description: "", path: `/blog/${slug}`, noIndex: true });
  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
    keywords: post.tags,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: [getAuthor(post.authorSlug)?.name ?? "IVOXA"],
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const author = getAuthor(post.authorSlug);
  const related = getRelatedPosts(post);

  return (
    <div className="container py-14">
      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.description,
          path: `/blog/${post.slug}`,
          image: "/og-image.png",
          authorName: author?.name ?? "IVOXA",
          publishedTime: post.publishedAt,
          modifiedTime: post.updatedAt,
        })}
      />
      <Breadcrumbs
        items={[
          { name: "Blog", path: "/blog" },
          { name: post.category, path: `/blog/category/${categorySlug(post.category)}` },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />

      <div className="max-w-3xl">
        <Badge variant="primary">{post.category}</Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{post.description}</p>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
          <Link href={`/blog/author/${author?.slug}`} className="flex items-center gap-3">
            <Avatar name={author?.name ?? "IVOXA"} size={36} />
            <div>
              <p className="text-sm font-semibold">{author?.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(post.publishedAt)} · {estimateReadingMinutes(post)} min read
              </p>
            </div>
          </Link>
          <ShareButtons path={`/blog/${post.slug}`} title={post.title} />
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr,16rem]">
        <article className="max-w-3xl">
          <ContentRenderer blocks={post.content} />
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag}>#{tag}</Badge>
            ))}
          </div>
        </article>
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <TableOfContents blocks={post.content} />
            <NewsletterSignup source={`blog-post-${post.slug}`} compact />
            <AdSlot label="Sidebar advertisement" />
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <div className="mt-16 border-t border-border pt-10">
          <h2 className="mb-5 text-xl font-bold tracking-tight">Related articles</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
