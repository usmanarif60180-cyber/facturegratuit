import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getAuthor } from "@/lib/content/blog/authors";
import { estimateReadingMinutes } from "@/lib/content/blog/posts";
import type { BlogPostWithContent } from "@/types/blog";

export function BlogCard({ post }: { post: BlogPostWithContent }) {
  const author = getAuthor(post.authorSlug);
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card hoverable className="h-full">
        <CardContent className="flex h-full flex-col pt-6">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-xl">
            {post.coverEmoji}
          </div>
          <Badge variant="primary" className="mb-2 w-fit">
            {post.category}
          </Badge>
          <h3 className="text-base font-semibold leading-snug">{post.title}</h3>
          <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{post.description}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>{author?.name}</span>
            <span>{estimateReadingMinutes(post)} min read</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
