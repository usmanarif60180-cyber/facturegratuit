"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff, GripVertical } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Input } from "@/components/ui/Input";
import { SECTION_LABELS } from "@/types/design";
import { DOCUMENT_STYLE_LABELS } from "@/lib/design/documentStyles";
import type { DesignConfig, DocumentStyleId } from "@/types/design";
import { cn } from "@/lib/utils/cn";

interface LayoutBuilderPanelProps {
  design: DesignConfig;
  onChange: (design: DesignConfig) => void;
}

export function LayoutBuilderPanel({ design, onChange }: LayoutBuilderPanelProps) {
  function move(index: number, dir: -1 | 1) {
    const next = [...design.sections];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target]!, next[index]!];
    onChange({ ...design, sections: next });
  }

  function toggleVisible(index: number) {
    const next = [...design.sections];
    next[index] = { ...next[index]!, visible: !next[index]!.visible };
    onChange({ ...design, sections: next });
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-1.5 block text-sm font-medium">Document style</label>
        <Select value={design.documentStyle} onChange={(e) => onChange({ ...design, documentStyle: e.target.value as DocumentStyleId })}>
          {Object.entries(DOCUMENT_STYLE_LABELS).map(([id, label]) => (
            <option key={id} value={id}>{label}</option>
          ))}
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Logo position</label>
          <Select value={design.logoPosition} onChange={(e) => onChange({ ...design, logoPosition: e.target.value as DesignConfig["logoPosition"] })}>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </Select>
          <p className="mt-1 text-xs text-muted-foreground">Applies when the document style is stacked or centered.</p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Watermark text</label>
          <Input
            placeholder="e.g. DRAFT, PAID, your company name"
            value={design.watermarkText ?? ""}
            onChange={(e) => onChange({ ...design, watermarkText: e.target.value })}
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Document sections</p>
        <p className="mb-3 text-xs text-muted-foreground">Reorder and show or hide each section. The identity header always stays at the top.</p>
        <ul className="space-y-1.5">
          {design.sections.map((section, i) => (
            <li
              key={section.id}
              className={cn(
                "flex items-center gap-2 rounded-md border border-border px-2.5 py-2",
                !section.visible && "opacity-50"
              )}
            >
              <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="flex-1 text-sm">{SECTION_LABELS[section.id]}</span>
              <button
                aria-label="Move up"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                aria-label="Move down"
                onClick={() => move(i, 1)}
                disabled={i === design.sections.length - 1}
                className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button aria-label="Toggle visibility" onClick={() => toggleVisible(i)} className="rounded p-1 text-muted-foreground hover:text-foreground">
                {section.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border p-3">
        <div>
          <p className="text-sm font-medium">Footer</p>
          <p className="text-xs text-muted-foreground">A closing line at the bottom of every document.</p>
        </div>
        <Switch checked={design.footerVisible} onChange={(v) => onChange({ ...design, footerVisible: v })} />
      </div>
      {design.footerVisible && (
        <Input
          placeholder="Thank you for your business."
          value={design.footerText ?? ""}
          onChange={(e) => onChange({ ...design, footerText: e.target.value })}
        />
      )}
    </div>
  );
}
