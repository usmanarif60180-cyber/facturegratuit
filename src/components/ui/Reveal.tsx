"use client";

import * as React from "react";
import { m, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type RevealVariant = "fade" | "slide" | "scale";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in milliseconds. */
  delay?: number;
  /** fade: opacity only · slide: fade + rise (default) · scale: fade + gentle zoom-in, for a hero-weight moment. */
  variant?: RevealVariant;
}

const OFFSETS: Record<RevealVariant, { y?: number; scale?: number }> = {
  fade: {},
  slide: { y: 14 },
  scale: { scale: 0.96 },
};

/** Reveals children into place the first time they scroll into view.
 * One-shot, GPU-cheap (opacity + transform only). Framer Motion's
 * `reducedMotion="user"` (set at the app root) already disables the
 * transform half of this for prefers-reduced-motion — the manual check
 * here just also skips the opacity fade so content never sits invisible. */
export function Reveal({ children, delay = 0, variant = "slide", className }: RevealProps) {
  const reducedMotion = useReducedMotion();
  const offset = OFFSETS[variant];

  return (
    <m.div
      className={cn(className)}
      initial={reducedMotion ? false : { opacity: 0, ...offset }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 260, damping: 26, delay: delay / 1000 }}
    >
      {children}
    </m.div>
  );
}
