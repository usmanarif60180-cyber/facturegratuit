"use client";

import * as React from "react";
import type { ColorPalette, DesignConfig } from "@/types/design";

interface ColorDesignerPanelProps {
  design: DesignConfig;
  onChange: (design: DesignConfig) => void;
}

const FIELDS: { key: keyof ColorPalette; label: string }[] = [
  { key: "primary", label: "Primary color" },
  { key: "secondary", label: "Secondary color" },
  { key: "accent", label: "Accent color" },
  { key: "headerBg", label: "Header background" },
  { key: "footerBg", label: "Footer background" },
  { key: "tableHeaderBg", label: "Table header" },
  { key: "border", label: "Borders" },
  { key: "icon", label: "Icons" },
  { key: "text", label: "Text" },
  { key: "muted", label: "Muted text" },
  { key: "statusPaid", label: "Paid badge" },
  { key: "statusPending", label: "Pending badge" },
  { key: "statusOverdue", label: "Overdue badge" },
];

export function ColorDesignerPanel({ design, onChange }: ColorDesignerPanelProps) {
  const palette = design.palette;
  const uid = React.useId();

  function set(key: keyof ColorPalette, value: string) {
    onChange({
      ...design,
      palette: { ...palette, [key]: value, id: palette.isCustom ? palette.id : `custom-${uid}`, name: palette.isCustom ? palette.name : "Custom palette", isCustom: true },
    });
  }

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Editing any color creates an unlimited custom palette on top of &ldquo;{palette.name}&rdquo;. Save it as a theme once you&rsquo;re happy.
      </p>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        {FIELDS.map((field) => (
          <div key={field.key} className="flex items-center gap-2.5">
            <input
              type="color"
              aria-label={field.label}
              value={palette[field.key] as string}
              onChange={(e) => set(field.key, e.target.value)}
              className="h-9 w-9 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{field.label}</p>
              <p className="truncate text-xs uppercase text-muted-foreground">{palette[field.key]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
