"use client";

import * as React from "react";
import { Star, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BUILTIN_TEMPLATES, TEMPLATE_CATEGORY_LABELS } from "@/lib/design/templates";
import type { Template, TemplateCategory } from "@/types/design";
import { cn } from "@/lib/utils/cn";

const CATEGORIES = Object.keys(TEMPLATE_CATEGORY_LABELS) as TemplateCategory[];
const FAVORITES_KEY = "ivoxa-template-favorites";
const RECENTS_KEY = "ivoxa-template-recents";

function readList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]");
  } catch {
    return [];
  }
}

export function TemplateGalleryPanel({ onApply }: { onApply: (template: Template) => void }) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<TemplateCategory | "all" | "favorites" | "recent">("all");
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [recents, setRecents] = React.useState<string[]>([]);

  React.useEffect(() => {
    setFavorites(readList(FAVORITES_KEY));
    setRecents(readList(RECENTS_KEY));
  }, []);

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }

  function applyTemplate(template: Template) {
    onApply(template);
    setRecents((prev) => {
      const next = [template.id, ...prev.filter((r) => r !== template.id)].slice(0, 8);
      localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
      return next;
    });
  }

  const filtered = BUILTIN_TEMPLATES.filter((tpl) => {
    if (category === "favorites") return favorites.includes(tpl.id);
    if (category === "recent") return recents.includes(tpl.id);
    if (category !== "all" && tpl.category !== category) return false;
    const q = query.toLowerCase();
    return !q || tpl.name.toLowerCase().includes(q) || tpl.description.toLowerCase().includes(q);
  });

  const recommended = BUILTIN_TEMPLATES.slice(0, 4);

  return (
    <div>
      <Input placeholder="Search templates…" value={query} onChange={(e) => setQuery(e.target.value)} className="mb-4 max-w-sm" />

      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "favorites", "recent"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition-colors",
              category === c ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {c}
          </button>
        ))}
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              category === c ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {TEMPLATE_CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      {category === "all" && !query && (
        <div className="mb-6">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Recommended
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {recommended.map((tpl) => (
              <TemplateCard key={tpl.id} template={tpl} favorite={favorites.includes(tpl.id)} onToggleFavorite={toggleFavorite} onApply={applyTemplate} />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {filtered.map((tpl) => (
          <TemplateCard key={tpl.id} template={tpl} favorite={favorites.includes(tpl.id)} onToggleFavorite={toggleFavorite} onApply={applyTemplate} />
        ))}
      </div>
      {filtered.length === 0 && <p className="text-sm text-muted-foreground">No templates match.</p>}
    </div>
  );
}

function TemplateCard({
  template,
  favorite,
  onToggleFavorite,
  onApply,
}: {
  template: Template;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
  onApply: (template: Template) => void;
}) {
  const { palette } = template.design;
  return (
    <div className="group overflow-hidden rounded-lg border border-border transition-shadow hover:shadow-elevated">
      <div className="relative h-28 overflow-hidden" style={{ background: palette.footerBg }}>
        <div className="absolute inset-x-0 top-0 h-8" style={{ background: palette.headerBg }} />
        <div className="absolute left-3 top-2.5 h-2 w-10 rounded-sm" style={{ background: palette.primary }} />
        <div className="absolute left-3 top-11 h-1.5 w-16 rounded-sm" style={{ background: palette.text, opacity: 0.6 }} />
        <div className="absolute left-3 top-14 h-1.5 w-12 rounded-sm" style={{ background: palette.muted, opacity: 0.5 }} />
        <div className="absolute inset-x-3 bottom-2.5 h-6 rounded-sm" style={{ background: palette.tableHeaderBg }} />
        <button
          onClick={() => onToggleFavorite(template.id)}
          aria-label="Toggle favorite"
          className="absolute right-2 top-2 rounded-full bg-white/80 p-1 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
        >
          <Star className={cn("h-3.5 w-3.5", favorite ? "fill-warning text-warning" : "text-muted-foreground")} />
        </button>
      </div>
      <div className="p-2.5">
        <p className="truncate text-xs font-semibold">{template.name}</p>
        <p className="truncate text-[11px] text-muted-foreground">{template.description}</p>
        <Button size="sm" variant="outline" className="mt-2 h-7 w-full text-xs" onClick={() => onApply(template)}>
          Apply
        </Button>
      </div>
    </div>
  );
}
