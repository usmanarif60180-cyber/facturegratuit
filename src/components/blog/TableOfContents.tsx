import type { ContentBlock } from "@/types/blog";

export function TableOfContents({ blocks }: { blocks: ContentBlock[] }) {
  const headings = blocks.filter((b): b is Extract<ContentBlock, { type: "heading" }> => b.type === "heading");
  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="rounded-lg border border-border bg-surface p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-1.5 text-sm">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "pl-3" : undefined}>
            <a href={`#${h.id}`} className="text-muted-foreground hover:text-primary">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
