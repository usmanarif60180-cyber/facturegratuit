"use client";

import * as React from "react";
import { useReducedMotion } from "./useReducedMotion";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/** Animates a displayed number toward `target` whenever it changes. Jumps
 * straight to the target when the user prefers reduced motion. */
export function useCountUp(target: number, duration = 700): number {
  const [value, setValue] = React.useState(target);
  const prevTarget = React.useRef(target);
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    if (reducedMotion) {
      setValue(target);
      prevTarget.current = target;
      return;
    }

    const from = prevTarget.current;
    const to = target;
    if (from === to) return;

    let frame: number;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setValue(from + (to - from) * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        prevTarget.current = to;
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, reducedMotion]);

  return value;
}
