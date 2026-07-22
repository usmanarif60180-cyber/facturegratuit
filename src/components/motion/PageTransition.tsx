"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";

/** Subtle fade + rise between route changes — fast and quiet on purpose;
 * this is chrome, not a moment to draw attention to. `mode="wait"` avoids
 * the outgoing and incoming page ever occupying the layout at once. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}
