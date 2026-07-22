"use client";

import * as React from "react";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";
import { AiOrb } from "./AiOrb";

const SPARKLINE_POINTS = "0,34 20,28 40,30 60,18 80,22 100,10 120,14 140,4";

const NETWORK_NODES = [
  { cx: 20, cy: 24, r: 2.4, delay: "0s" },
  { cx: 70, cy: 10, r: 1.8, delay: "0.6s" },
  { cx: 110, cy: 30, r: 2.2, delay: "1.2s" },
  { cx: 150, cy: 14, r: 1.6, delay: "0.3s" },
  { cx: 185, cy: 40, r: 2, delay: "0.9s" },
  { cx: 40, cy: 60, r: 1.6, delay: "1.5s" },
  { cx: 160, cy: 70, r: 2.2, delay: "0.2s" },
];

const NETWORK_LINES: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [2, 6],
];

const SPRING = { stiffness: 120, damping: 18, mass: 0.4 };

/** Decorative hero panel: an AI Orb backdrop (the one Spline-equivalent
 * 3D object for the whole site), a stylized dashboard preview, two
 * floating glass data cards, and a faint AI-network overlay. Everything
 * tilts gently toward the cursor via spring-smoothed Framer Motion
 * values, shared by the orb and the panel — `reducedMotion="user"` on
 * the app's MotionConfig disables this automatically. */
export function HeroVisual() {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const springPx = useSpring(px, SPRING);
  const springPy = useSpring(py, SPRING);
  const rotateX = useTransform(springPy, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(springPx, [-0.5, 0.5], [-6, 6]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto w-full max-w-md [perspective:1200px]"
      aria-hidden="true"
    >
      <AiOrb px={springPx} py={springPy} />

      <svg
        className="pointer-events-none absolute -inset-10 -z-10 text-primary/40"
        viewBox="0 0 200 90"
        fill="none"
      >
        {NETWORK_LINES.map(([a, b], i) => {
          const from = NETWORK_NODES[a]!;
          const to = NETWORK_NODES[b]!;
          return (
            <line
              key={i}
              x1={from.cx}
              y1={from.cy}
              x2={to.cx}
              y2={to.cy}
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.25"
            />
          );
        })}
        {NETWORK_NODES.map((node, i) => (
          <circle
            key={i}
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill="currentColor"
            className="animate-node-pulse"
            style={{ animationDelay: node.delay }}
          />
        ))}
      </svg>

      <m.div
        className="rounded-2xl border border-border bg-card p-5 shadow-elevated will-change-transform"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-danger/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
          </div>
          <span className="flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-success" />
            Live
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Revenue this month</p>
            <p className="mt-1 text-2xl font-bold tracking-tight">$12,840</p>
          </div>
          <span className="flex items-center gap-0.5 rounded-full bg-success/10 px-2 py-1 text-xs font-semibold text-success">
            <ArrowUpRight className="h-3 w-3" /> 18%
          </span>
        </div>

        <svg viewBox="0 0 140 40" className="mt-3 h-10 w-full text-primary" fill="none">
          <polyline points={SPARKLINE_POINTS} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div className="mt-4 space-y-2 border-t border-border pt-3">
          {[
            { label: "INV-0042 · Atlas Studio", status: "Paid" },
            { label: "INV-0041 · Nova Digital", status: "Pending" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{row.label}</span>
              <span
                className={
                  row.status === "Paid"
                    ? "rounded-full bg-success/10 px-2 py-0.5 font-medium text-success"
                    : "rounded-full bg-warning/10 px-2 py-0.5 font-medium text-warning"
                }
              >
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </m.div>

      <div className="glass absolute -left-10 -top-7 hidden animate-float rounded-xl px-3.5 py-2.5 sm:block">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-semibold">Invoice paid</p>
            <p className="text-[0.65rem] text-muted-foreground">$1,240.00</p>
          </div>
        </div>
      </div>

      <div className="glass absolute -right-10 -bottom-12 hidden animate-float-delayed rounded-xl px-3.5 py-2.5 sm:block">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-semibold">AI suggestion</p>
            <p className="text-[0.65rem] text-muted-foreground">Offer a 2% early discount</p>
          </div>
        </div>
      </div>
    </div>
  );
}
