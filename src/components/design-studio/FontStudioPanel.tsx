"use client";

import { Select } from "@/components/ui/Select";
import { FONT_OPTIONS } from "@/lib/design/fonts";
import type { DesignConfig, FontId } from "@/types/design";

interface FontStudioPanelProps {
  design: DesignConfig;
  onChange: (design: DesignConfig) => void;
}

const FONT_ROLES: { key: keyof DesignConfig["typography"] & ("headingFont" | "bodyFont" | "tableFont" | "footerFont"); label: string }[] = [
  { key: "headingFont", label: "Heading font" },
  { key: "bodyFont", label: "Body font" },
  { key: "tableFont", label: "Table font" },
  { key: "footerFont", label: "Footer font" },
];

export function FontStudioPanel({ design, onChange }: FontStudioPanelProps) {
  const typo = design.typography;

  function set(patch: Partial<DesignConfig["typography"]>) {
    onChange({ ...design, typography: { ...typo, ...patch } });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {FONT_ROLES.map((role) => (
          <div key={role.key}>
            <label className="mb-1.5 block text-sm font-medium">{role.label}</label>
            <Select value={typo[role.key]} onChange={(e) => set({ [role.key]: e.target.value as FontId })}>
              {FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </Select>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 flex justify-between text-sm font-medium">
            Font size <span className="text-muted-foreground">{typo.baseFontSize}px</span>
          </label>
          <input
            type="range"
            min={11}
            max={16}
            value={typo.baseFontSize}
            onChange={(e) => set({ baseFontSize: Number(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 flex justify-between text-sm font-medium">
            Line height <span className="text-muted-foreground">{typo.lineHeight.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={1.2}
            max={1.8}
            step={0.05}
            value={typo.lineHeight}
            onChange={(e) => set({ lineHeight: Number(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 flex justify-between text-sm font-medium">
            Letter spacing <span className="text-muted-foreground">{typo.letterSpacing.toFixed(2)}em</span>
          </label>
          <input
            type="range"
            min={-0.01}
            max={0.06}
            step={0.005}
            value={typo.letterSpacing}
            onChange={(e) => set({ letterSpacing: Number(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Heading weight</label>
          <Select value={String(typo.headingWeight)} onChange={(e) => set({ headingWeight: Number(e.target.value) as 500 | 600 | 700 | 800 })}>
            <option value="500">Medium</option>
            <option value="600">Semibold</option>
            <option value="700">Bold</option>
            <option value="800">Extrabold</option>
          </Select>
        </div>
      </div>
    </div>
  );
}
