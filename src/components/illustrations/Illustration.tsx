import { cn } from "@/lib/utils/cn";
import { SCENES, type IllustrationVariant } from "./scenes";

interface IllustrationProps {
  variant: IllustrationVariant;
  size?: number;
  /** Wraps the artwork in the soft-shadow "floating card" frame. Off for inline use (e.g. small empty states). */
  framed?: boolean;
  className?: string;
}

export function Illustration({ variant, size = 96, framed = true, className }: IllustrationProps) {
  const svg = (
    <svg viewBox="0 0 96 96" width={size} height={size} className="text-primary" aria-hidden="true">
      {SCENES[variant]}
    </svg>
  );

  if (!framed) return <div className={className}>{svg}</div>;

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-secondary/5 p-4 shadow-card",
        className
      )}
    >
      {svg}
    </div>
  );
}

export type { IllustrationVariant };
