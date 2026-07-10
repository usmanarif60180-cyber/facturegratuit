"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { BlogCard } from "./BlogCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils/cn";
import type { BlogCategory, BlogPostWithContent } from "@/types/blog";

export function BlogExplorer({ posts }: { posts: BlogPostWithContent[] }) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<BlogCategory | "all">("all");

  const categories = Array.from(new Set(posts.map((p) => p.category))) as BlogCategory[];

  const filtered = posts.filter((post) => {
    const matchesCategory = category === "all" || post.category === category;
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.description.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles…"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search articles"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("all")}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold",
              category === "all"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold",
                category === c
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          illustration="smart-reports"
          title="No articles match your search"
          description="Try a different keyword or category."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
