import { ShieldCheck, Lock, Globe2, Zap } from "lucide-react";

const ITEMS = [
  { icon: ShieldCheck, label: "Firebase-secured authentication" },
  { icon: Lock, label: "Organization-scoped data access" },
  { icon: Globe2, label: "Built for every country & currency" },
  { icon: Zap, label: "Fast by default, everywhere" },
];

export function TrustStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-6 text-sm text-muted-foreground">
      {ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <item.icon className="h-4 w-4 text-primary" aria-hidden="true" />
          {item.label}
        </div>
      ))}
    </div>
  );
}
