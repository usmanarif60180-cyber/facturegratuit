import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BlogCard } from "@/components/blog/BlogCard";
import { Avatar } from "@/components/ui/Avatar";
import { buildMetadata } from "@/lib/seo/metadata";
import { AUTHORS, getAuthor } from "@/lib/content/blog/authors";
import { getPostsByAuthor } from "@/lib/content/blog/posts";

export function generateStaticParams() {
  return AUTHORS.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) return buildMetadata({ title: "Author not found", description: "", path: `/blog/author/${slug}`, noIndex: true });
  return buildMetadata({
    title: author.name,
    description: author.bio,
    path: `/blog/author/${author.slug}`,
  });
}

export default async function BlogAuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();
  const posts = getPostsByAuthor(author.slug);

  return (
    <div className="container py-14">
      <Breadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: author.name, path: `/blog/author/${author.slug}` }]} />
      <div className="flex items-center gap-4">
        <Avatar name={author.name} size={56} />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{author.name}</h1>
          <p className="text-sm text-muted-foreground">{author.role}</p>
        </div>
      </div>
      <p className="mt-4 max-w-2xl text-muted-foreground">{author.bio}</p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
