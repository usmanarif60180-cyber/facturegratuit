import * as React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/utils/cn";

interface StatCardProps {
  label: string;
  /** Raw numeric value — animated with a count-up whenever it changes. */
  value: number;
  /** Formats the (possibly mid-animation) numeric value for display. Defaults to a plain integer string. */
  formatValue?: (value: number) => string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: string; positive?: boolean };
}

export function StatCard({ label, value, formatValue, icon: Icon, trend }: StatCardProps) {
  const animated = useCountUp(value);
  const display = formatValue ? formatValue(animated) : String(Math.round(animated));

  return (
    <Card>
      <CardContent className="flex items-start justify-between pt-6">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className={cn("mt-1.5 text-2xl font-bold tracking-tight tabular-nums")}>{display}</p>
          {trend && (
            <p
              className={cn(
                "mt-1.5 text-xs font-medium",
                trend.positive ? "text-success" : "text-muted-foreground"
              )}
            >
              {trend.value}
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );
}
