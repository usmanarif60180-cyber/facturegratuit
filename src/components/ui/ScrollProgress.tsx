"use client";

import * as React from "react";

/** Thin gradient bar pinned to the top of the viewport, tracking scroll
 * position — the "cinematic" cue that there's more page below the fold. */
export function ScrollProgress() {
  const barRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let ticking = false;

    function update() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const progress = scrollable > 0 ? doc.scrollTop / scrollable : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent" aria-hidden="true">
      <div
        ref={barRef}
        className="scroll-progress h-full w-full bg-gradient-to-r from-primary to-secondary"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
