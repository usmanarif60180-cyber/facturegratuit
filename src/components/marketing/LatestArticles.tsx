import Link from "next/link";
import { BlogCard } from "@/components/blog/BlogCard";
import { BLOG_POSTS } from "@/lib/content/blog/posts";

export function LatestArticles({ limit = 3 }: { limit?: number }) {
  const posts = [...BLOG_POSTS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1)).slice(0, limit);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Latest from the blog</h2>
        <Link href="/blog" className="text-sm font-semibold text-primary hover:underline">
          View all articles
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
