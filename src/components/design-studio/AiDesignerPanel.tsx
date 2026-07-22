"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { applyAiMatch, parseDesignPrompt } from "@/lib/design/aiDesigner";
import type { DesignConfig } from "@/types/design";

interface AiDesignerPanelProps {
  design: DesignConfig;
  onChange: (design: DesignConfig) => void;
}

const SUGGESTIONS = [
  "Create a modern blue invoice",
  "Create a luxury black quotation",
  "Use construction style",
  "Use elegant gold branding",
];

export function AiDesignerPanel({ design, onChange }: AiDesignerPanelProps) {
  const [prompt, setPrompt] = React.useState("");
  const [lastMatch, setLastMatch] = React.useState<string[] | null>(null);

  function run(text: string) {
    const match = parseDesignPrompt(text);
    onChange(applyAiMatch(design, match));
    setLastMatch(match.matchedTerms.length ? match.matchedTerms : []);
  }

  return (
    <div>
      <div className="mb-4 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-sm text-muted-foreground">
          Describe the look you want and IVOXA applies matching colors, fonts and layout instantly. This runs on a
          deterministic keyword matcher today — no external AI provider is connected yet, so it works instantly and
          without an API key.
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Create a modern blue invoice…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run(prompt)}
        />
        <Button onClick={() => run(prompt)} className="shrink-0 gap-2">
          <Sparkles className="h-4 w-4" /> Apply
        </Button>
      </div>

      {lastMatch !== null && (
        <p className="mt-2 text-xs text-muted-foreground">
          {lastMatch.length > 0 ? (
            <>Matched: {lastMatch.map((m) => <Badge key={m} variant="primary" className="ml-1">{m}</Badge>)}</>
          ) : (
            "No keywords recognized — try a style (modern, luxury, minimal…) or a color (blue, gold, black…)."
          )}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => { setPrompt(s); run(s); }}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
