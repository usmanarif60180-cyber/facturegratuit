"use client";

import { m } from "framer-motion";

const DOTS = [0, 0.15, 0.3];

export function TypingIndicator() {
  return (
    <m.div
      className="flex w-fit items-center gap-1 rounded-lg bg-muted px-4 py-3"
      role="status"
      aria-label="Assistant is responding"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6, transition: { duration: 0.12 } }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
    >
      {DOTS.map((delay) => (
        <m.span
          key={delay}
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
          animate={{ opacity: [1, 0.3, 1], scale: [1, 0.7, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, delay, ease: "easeInOut" }}
        />
      ))}
    </m.div>
  );
}
