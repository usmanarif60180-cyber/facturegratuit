"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import type { HelpArticle } from "@/types/help";

export function HelpSearch({ articles }: { articles: HelpArticle[] }) {
  const [query, setQuery] = React.useState("");

  const results = query
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search help articles…"
        className="pl-9"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search help articles"
      />
      {query && (
        <div className="absolute z-20 mt-2 w-full rounded-lg border border-border bg-popover shadow-popover">
          {results.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">No articles found.</p>
          ) : (
            <ul className="max-h-72 overflow-y-auto p-1">
              {results.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/help/${article.slug}`}
                    className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                  >
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
