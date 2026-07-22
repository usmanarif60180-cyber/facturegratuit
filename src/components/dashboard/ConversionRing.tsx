"use client";

import * as React from "react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ConversionRingProps {
  label: string;
  percent: number;
  size?: number;
}

/** Animated radial progress ring — the stroke draws in once the ring
 * scrolls into view. Pure SVG, no charting library needed for a single
 * value. */
export function ConversionRing({ label, percent, size = 128 }: ConversionRingProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const reducedMotion = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, percent));

  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - (inView || reducedMotion ? clamped : 0) / 100);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="9"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: reducedMotion ? "none" : "stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xl font-bold tabular-nums">
          {Math.round(clamped)}%
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
