"use client";

import { m, useTransform, type MotionValue } from "framer-motion";

interface AiOrbProps {
  /** Normalized pointer offset from center, -0.5..0.5, spring-smoothed by the caller. */
  px: MotionValue<number>;
  py: MotionValue<number>;
  size?: number;
}

const CORE_NODES = [
  { cx: 50, cy: 42, r: 2.4, delay: "0s" },
  { cx: 62, cy: 55, r: 1.6, delay: "0.5s" },
  { cx: 40, cy: 58, r: 1.8, delay: "1s" },
  { cx: 55, cy: 68, r: 1.4, delay: "1.4s" },
];

/**
 * The "one premium interactive 3D object" for the hero. Not a literal
 * Spline scene (that needs Spline's own web editor to author) — this
 * reaches the same brief (glass sphere, soft lighting, premium
 * reflections, mouse-reactive, minimal movement) with layered CSS
 * gradients and Framer Motion, so it's honestly what it looks like: no
 * external 3D asset, no extra runtime, fully GPU-cheap (transform +
 * opacity only).
 */
export function AiOrb({ px, py, size = 300 }: AiOrbProps) {
  const rotateX = useTransform(py, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(px, [-0.5, 0.5], [-12, 12]);
  const highlightX = useTransform(px, [-0.5, 0.5], [30, 70]);
  const highlightY = useTransform(py, [-0.5, 0.5], [25, 55]);

  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[42%] -z-10"
      style={{ width: size, height: size, x: "-50%", y: "-50%", rotateX, rotateY, transformStyle: "preserve-3d" }}
      animate={{ y: ["-52%", "-48%", "-52%"] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* ambient glow */}
      <div
        className="absolute inset-[-10%] rounded-full opacity-70 blur-2xl"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.28), hsl(var(--secondary)/0.12) 55%, transparent 75%)" }}
      />

      {/* sphere body */}
      <m.div
        className="absolute inset-0 overflow-hidden rounded-full shadow-[0_30px_60px_-20px_hsl(var(--primary)/0.35)]"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, hsl(var(--primary)/0.55), hsl(var(--secondary)/0.5) 45%, hsl(var(--foreground)/0.14) 100%)",
        }}
      >
        {/* glass highlight, follows the cursor */}
        <m.div
          className="absolute h-2/3 w-2/3 rounded-full opacity-60 blur-2xl"
          style={{
            left: highlightX,
            top: highlightY,
            x: "-50%",
            y: "-50%",
            background: "radial-gradient(circle, white, transparent 70%)",
          }}
        />
        {/* rim light */}
        <div
          className="absolute inset-0 rounded-full mix-blend-overlay"
          style={{ background: "conic-gradient(from 210deg, transparent 0deg, hsl(var(--primary-foreground)/0.5) 40deg, transparent 90deg)" }}
        />
        {/* inner glass surface + subtle AI network core */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-primary-foreground/70">
          <circle cx="50" cy="50" r="49" fill="url(#orb-glass)" />
          <defs>
            <radialGradient id="orb-glass" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="white" stopOpacity="0.35" />
              <stop offset="45%" stopColor="white" stopOpacity="0.05" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          {CORE_NODES.map((n, i) => (
            <circle key={i} cx={n.cx} cy={n.cy} r={n.r} fill="currentColor" className="animate-node-pulse" style={{ animationDelay: n.delay }} />
          ))}
          <path d="M50 42 L62 55 M50 42 L40 58 M40 58 L55 68" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
        </svg>
        {/* soft inner shadow for depth */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_-18px_40px_-10px_rgba(0,0,0,0.25)]" />
      </m.div>
    </m.div>
  );
}
