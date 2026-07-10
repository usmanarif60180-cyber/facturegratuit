"use client";

import * as React from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils/cn";

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Stagger delay in milliseconds. */
  delay?: number;
}

/** Fades and lifts children into place the first time they scroll into
 * view. One-shot, GPU-cheap (opacity + transform only), and inert when the
 * user prefers reduced motion (handled globally via the CSS media query). */
export function Reveal({ children, delay = 0, className, style, ...props }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-500 ease-out",
        inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        className
      )}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms", ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
