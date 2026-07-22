import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BlogCard } from "@/components/blog/BlogCard";
import { buildMetadata } from "@/lib/seo/metadata";
import { categoryFromSlug, categorySlug, getAllCategories, getPostsByCategory } from "@/lib/content/blog/posts";

export function generateStaticParams() {
  return getAllCategories().map((category) => ({ category: categorySlug(category) }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: categoryParam } = await params;
  const category = categoryFromSlug(categoryParam);
  if (!category) return buildMetadata({ title: "Category not found", description: "", path: `/blog/category/${categoryParam}`, noIndex: true });
  return buildMetadata({
    title: `${category} articles`,
    description: `Guides and articles about ${category.toLowerCase()} from the IVOXA blog.`,
    path: `/blog/category/${categorySlug(category)}`,
  });
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryParam } = await params;
  const category = categoryFromSlug(categoryParam);
  if (!category) notFound();
  const posts = getPostsByCategory(category);

  return (
    <div className="container py-14">
      <Breadcrumbs
        items={[
          { name: "Blog", path: "/blog" },
          { name: category, path: `/blog/category/${categorySlug(category)}` },
        ]}
      />
      <h1 className="text-3xl font-bold tracking-tight">{category}</h1>
      <p className="mt-2 text-muted-foreground">
        {posts.length} article{posts.length === 1 ? "" : "s"} about {category.toLowerCase()}.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
