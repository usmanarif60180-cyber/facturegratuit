"use client";

import * as React from "react";
import { Check, Copy, Download, Star, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { BUILTIN_PALETTES } from "@/lib/design/palettes";
import { cn } from "@/lib/utils/cn";
import type { DesignConfig, SavedDesign } from "@/types/design";

interface ThemeDesignerPanelProps {
  design: DesignConfig;
  onChange: (design: DesignConfig) => void;
  savedThemes: SavedDesign[];
  onSaveTheme: (name: string) => Promise<void>;
  onRenameTheme: (id: string, name: string) => Promise<void>;
  onDuplicateTheme: (theme: SavedDesign) => Promise<void>;
  onDeleteTheme: (id: string) => Promise<void>;
  onSetDefault: (theme: SavedDesign) => void;
  defaultThemeId?: string;
}

export function ThemeDesignerPanel({
  design,
  onChange,
  savedThemes,
  onSaveTheme,
  onRenameTheme,
  onDuplicateTheme,
  onDeleteTheme,
  onSetDefault,
  defaultThemeId,
}: ThemeDesignerPanelProps) {
  const { toast } = useToast();
  const [newName, setNewName] = React.useState("");
  const [renamingId, setRenamingId] = React.useState<string | null>(null);
  const [renameValue, setRenameValue] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  async function handleSave() {
    const name = newName.trim() || `Custom theme ${savedThemes.length + 1}`;
    await onSaveTheme(name);
    setNewName("");
    toast({ variant: "success", title: "Theme saved" });
  }

  function handleExport(theme: SavedDesign) {
    const blob = new Blob([JSON.stringify(theme.config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${theme.name.toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const config = JSON.parse(text) as DesignConfig;
      onChange({ ...config, id: `imported-${Date.now()}`, name: config.name || "Imported theme" });
      toast({ variant: "success", title: "Theme imported — customize and save it" });
    } catch {
      toast({ variant: "error", title: "Could not read that file" });
    }
    e.target.value = "";
  }

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Built-in themes</p>
      <div className="mb-6 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {BUILTIN_PALETTES.map((palette) => (
          <button
            key={palette.id}
            onClick={() => onChange({ ...design, palette })}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-lg border p-2.5 transition-colors",
              design.palette.id === palette.id ? "border-primary bg-primary/5" : "border-border hover:border-foreground/25"
            )}
          >
            <span className="flex h-8 w-full overflow-hidden rounded-md">
              <span className="flex-1" style={{ background: palette.primary }} />
              <span className="flex-1" style={{ background: palette.secondary }} />
              <span className="flex-1" style={{ background: palette.accent }} />
            </span>
            <span className="text-[11px] font-medium">{palette.name}</span>
          </button>
        ))}
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your custom themes</p>
      {savedThemes.length === 0 && <p className="mb-3 text-sm text-muted-foreground">No saved themes yet — save your current design below.</p>}
      <ul className="mb-4 space-y-2">
        {savedThemes.map((theme) => (
          <li key={theme.id} className="flex items-center justify-between gap-2 rounded-lg border border-border p-2.5">
            {renamingId === theme.id ? (
              <div className="flex flex-1 items-center gap-2">
                <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} className="h-8 text-sm" />
                <Button size="sm" className="h-8" onClick={async () => { await onRenameTheme(theme.id, renameValue); setRenamingId(null); }}>
                  <Check className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <button className="flex-1 text-left text-sm font-medium" onClick={() => onChange(theme.config)}>
                {theme.name}
                {defaultThemeId === theme.id && <span className="ml-2 text-[10px] font-semibold uppercase text-primary">Default</span>}
              </button>
            )}
            <div className="flex items-center gap-1">
              <button aria-label="Set as default" onClick={() => onSetDefault(theme)} className="rounded p-1.5 text-muted-foreground hover:text-warning">
                <Star className={cn("h-3.5 w-3.5", defaultThemeId === theme.id && "fill-warning text-warning")} />
              </button>
              <button aria-label="Rename" onClick={() => { setRenamingId(theme.id); setRenameValue(theme.name); }} className="rounded p-1.5 text-muted-foreground hover:text-foreground">
                <span className="text-xs font-semibold">Aa</span>
              </button>
              <button aria-label="Duplicate" onClick={() => onDuplicateTheme(theme)} className="rounded p-1.5 text-muted-foreground hover:text-foreground">
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button aria-label="Export" onClick={() => handleExport(theme)} className="rounded p-1.5 text-muted-foreground hover:text-foreground">
                <Download className="h-3.5 w-3.5" />
              </button>
              <button aria-label="Delete" onClick={() => onDeleteTheme(theme.id)} className="rounded p-1.5 text-muted-foreground hover:text-danger">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-2">
        <Input placeholder="Name this theme…" value={newName} onChange={(e) => setNewName(e.target.value)} className="h-9 max-w-xs" />
        <Button size="sm" onClick={handleSave}>Save current as theme</Button>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={handleImportClick}>
          <Upload className="h-3.5 w-3.5" /> Import
        </Button>
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
      </div>
    </div>
  );
}
