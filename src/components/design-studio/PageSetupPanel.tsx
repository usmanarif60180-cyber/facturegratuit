"use client";

import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import type { DesignConfig } from "@/types/design";

interface PageSetupPanelProps {
  design: DesignConfig;
  onChange: (design: DesignConfig) => void;
}

export function PageSetupPanel({ design, onChange }: PageSetupPanelProps) {
  const page = design.page;

  function set(patch: Partial<DesignConfig["page"]>) {
    onChange({ ...design, page: { ...page, ...patch } });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Page size</label>
          <Select value={page.size} onChange={(e) => set({ size: e.target.value as DesignConfig["page"]["size"] })}>
            <option value="a4">A4</option>
            <option value="letter">Letter</option>
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Orientation</label>
          <Select value={page.orientation} onChange={(e) => set({ orientation: e.target.value as DesignConfig["page"]["orientation"] })}>
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Margins</label>
          <Select value={page.margin} onChange={(e) => set({ margin: e.target.value as DesignConfig["page"]["margin"] })}>
            <option value="narrow">Narrow</option>
            <option value="normal">Normal</option>
            <option value="wide">Wide</option>
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Spacing density</label>
          <Select value={design.spacing} onChange={(e) => onChange({ ...design, spacing: e.target.value as DesignConfig["spacing"] })}>
            <option value="compact">Compact</option>
            <option value="normal">Normal</option>
            <option value="relaxed">Relaxed</option>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border p-3">
        <div>
          <p className="text-sm font-medium">Page numbers</p>
          <p className="text-xs text-muted-foreground">Show a footer page counter — accurate for single-page documents.</p>
        </div>
        <Switch checked={page.pageNumbers} onChange={(v) => set({ pageNumbers: v })} />
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border p-3">
        <div>
          <p className="text-sm font-medium">Repeat table header</p>
          <p className="text-xs text-muted-foreground">Reprint column headers on every page for multi-page invoices.</p>
        </div>
        <Switch checked={page.repeatHeader} onChange={(v) => set({ repeatHeader: v })} />
      </div>
    </div>
  );
}
