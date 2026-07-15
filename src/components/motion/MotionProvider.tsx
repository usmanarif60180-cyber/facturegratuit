"use client";

import * as React from "react";
import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";

/** Loads only the "domAnimation" feature bundle (transforms, gestures,
 * layout — no drag/reorder) via LazyMotion, keeping the animation runtime
 * code-split rather than bundled into the initial chunk. Every animated
 * component in the app should import `m` (not `motion`) from
 * "framer-motion" to benefit from this. `reducedMotion="user"` defers to
 * the OS-level prefers-reduced-motion setting automatically, on top of
 * the existing CSS-level kill-switch in globals.css. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
