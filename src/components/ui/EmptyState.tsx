import * as React from "react";
import { Illustration, type IllustrationVariant } from "@/components/illustrations/Illustration";
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  icon?: React.ReactNode;
  /** Preferred over `icon` — renders one of the custom IVOXA illustrations. */
  illustration?: IllustrationVariant;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, illustration, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-16 text-center",
        className
      )}
    >
      {illustration ? (
        <Illustration variant={illustration} size={72} className="mb-4" />
      ) : (
        icon && (
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            {icon}
          </div>
        )
      )}
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
