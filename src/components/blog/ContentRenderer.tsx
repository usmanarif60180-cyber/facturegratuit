import { AlertTriangle, Info, Lightbulb } from "lucide-react";
import type { ContentBlock } from "@/types/blog";
import { cn } from "@/lib/utils/cn";

const CALLOUT_STYLES = {
  tip: { icon: Lightbulb, className: "border-primary/30 bg-primary/5 text-primary" },
  info: { icon: Info, className: "border-info/30 bg-info/5 text-info" },
  warning: { icon: AlertTriangle, className: "border-warning/30 bg-warning/5 text-warning" },
};

export function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="max-w-none space-y-5">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading": {
            const Tag = block.level === 2 ? "h2" : "h3";
            return (
              <Tag
                key={index}
                id={block.id}
                className={cn(
                  "scroll-mt-24 font-bold tracking-tight",
                  block.level === 2 ? "pt-3 text-xl" : "pt-1 text-lg"
                )}
              >
                {block.text}
              </Tag>
            );
          }
          case "paragraph":
            return (
              <p key={index} className="text-[0.95rem] leading-7 text-foreground/90">
                {block.text}
              </p>
            );
          case "list": {
            const ListTag = block.ordered ? "ol" : "ul";
            return (
              <ListTag
                key={index}
                className={cn(
                  "space-y-2 pl-5 text-[0.95rem] leading-7 text-foreground/90",
                  block.ordered ? "list-decimal" : "list-disc"
                )}
              >
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ListTag>
            );
          }
          case "quote":
            return (
              <blockquote key={index} className="border-l-2 border-primary pl-4 italic text-muted-foreground">
                {block.text}
                {block.cite && <cite className="mt-1 block text-sm not-italic">— {block.cite}</cite>}
              </blockquote>
            );
          case "callout": {
            const style = CALLOUT_STYLES[block.tone];
            const Icon = style.icon;
            return (
              <div key={index} className={cn("flex gap-3 rounded-lg border p-4 text-sm", style.className)}>
                <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p className="leading-6 text-foreground/90">{block.text}</p>
              </div>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
