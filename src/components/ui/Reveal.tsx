"use client";

import * as React from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils/cn";

type RevealVariant = "fade" | "slide" | "scale";

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Stagger delay in milliseconds. */
  delay?: number;
  /** fade: opacity only · slide: fade + rise (default) · scale: fade + gentle zoom-in, for a hero-weight moment. */
  variant?: RevealVariant;
}

const HIDDEN: Record<RevealVariant, string> = {
  fade: "opacity-0",
  slide: "translate-y-3 opacity-0",
  scale: "scale-[0.96] opacity-0",
};

const VISIBLE: Record<RevealVariant, string> = {
  fade: "opacity-100",
  slide: "translate-y-0 opacity-100",
  scale: "scale-100 opacity-100",
};

/** Reveals children into place the first time they scroll into view.
 * One-shot, GPU-cheap (opacity + transform only), and inert when the user
 * prefers reduced motion (handled globally via the CSS media query). */
export function Reveal({ children, delay = 0, variant = "slide", className, style, ...props }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-500 ease-out",
        inView ? VISIBLE[variant] : HIDDEN[variant],
        className
      )}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms", ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
