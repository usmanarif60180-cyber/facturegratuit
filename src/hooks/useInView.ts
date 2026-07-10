"use client";

import * as React from "react";

/** Fires once when the element first enters the viewport — the basis for
 * scroll-triggered reveal animations, without pulling in a scroll library. */
export function useInView<T extends HTMLElement>(options?: { rootMargin?: string; threshold?: number }) {
  const ref = React.useRef<T | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: options?.rootMargin ?? "0px 0px -10% 0px", threshold: options?.threshold ?? 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return { ref, inView };
}
