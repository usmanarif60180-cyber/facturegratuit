"use client";

import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { TABLE_STYLE_LABELS, TABLE_STYLE_PRESETS } from "@/lib/design/tableStyles";
import type { DesignConfig, TableStyleId } from "@/types/design";
import { cn } from "@/lib/utils/cn";

interface TableDesignPanelProps {
  design: DesignConfig;
  onChange: (design: DesignConfig) => void;
}

const STYLES = Object.keys(TABLE_STYLE_LABELS) as TableStyleId[];

export function TableDesignPanel({ design, onChange }: TableDesignPanelProps) {
  const table = design.table;

  function set(patch: Partial<DesignConfig["table"]>) {
    onChange({ ...design, table: { ...table, ...patch } });
  }

  function pickStyle(style: TableStyleId) {
    onChange({ ...design, table: { style, ...TABLE_STYLE_PRESETS[style] } });
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium">Table style</p>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <button
              key={s}
              onClick={() => pickStyle(s)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                table.style === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {TABLE_STYLE_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Border thickness</label>
          <Select value={String(table.borderThickness)} onChange={(e) => set({ borderThickness: Number(e.target.value) as 0 | 1 | 2 })}>
            <option value="0">None</option>
            <option value="1">Thin</option>
            <option value="2">Thick</option>
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Row height</label>
          <Select value={table.rowHeight} onChange={(e) => set({ rowHeight: e.target.value as DesignConfig["table"]["rowHeight"] })}>
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
            <option value="spacious">Spacious</option>
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Header style</label>
          <Select value={table.headerStyle} onChange={(e) => set({ headerStyle: e.target.value as DesignConfig["table"]["headerStyle"] })}>
            <option value="filled">Filled</option>
            <option value="outline">Outline</option>
            <option value="underline">Underline</option>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border p-3">
        <div>
          <p className="text-sm font-medium">Alternating row colors</p>
          <p className="text-xs text-muted-foreground">Zebra-stripe the line items table.</p>
        </div>
        <Switch checked={table.alternatingRows} onChange={(v) => set({ alternatingRows: v })} />
      </div>
    </div>
  );
}
