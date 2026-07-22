"use client";

import * as React from "react";

/** Mirrors the OS-level "reduce motion" preference so JS-driven animations
 * (count-up, canvas/SVG effects) can skip themselves — CSS animations are
 * already handled globally in globals.css. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return reduced;
}
