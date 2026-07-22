/**
 * Raw SVG content for each illustration scene. Every scene shares the same
 * visual grammar: 1.6px rounded strokes in the current color, a single
 * secondary-tone fill used sparingly for depth, and a 0–96 viewBox. Kept
 * separate from <Illustration> so the frame/style logic never duplicates
 * per-scene.
 */
import type { ReactNode } from "react";

export type IllustrationVariant =
  | "ai-assistant"
  | "invoice-generation"
  | "quote-generation"
  | "financial-dashboard"
  | "business-analytics"
  | "client-management"
  | "team-collaboration"
  | "automation"
  | "business-growth"
  | "cloud-infrastructure"
  | "cyber-security"
  | "digital-workspace"
  | "smart-reports"
  | "multi-currency"
  | "global-business"
  | "payment-processing"
  | "productivity"
  | "ai-insights";

const S = "currentColor";
const ACCENT = "hsl(var(--secondary))";

export const SCENES: Record<IllustrationVariant, ReactNode> = {
  "ai-assistant": (
    <>
      <circle cx="48" cy="50" r="26" fill={ACCENT} fillOpacity="0.12" />
      <rect x="26" y="30" width="44" height="32" rx="10" stroke={S} strokeWidth="1.6" />
      <path d="M40 46 l0 4 M56 46 l0 4" stroke={S} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M34 62 l6 8 6 -8" stroke={S} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M48 22 v6 M42 24 l3 5 M54 24 l-3 5" stroke={S} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="48" cy="16" r="3" fill={S} />
    </>
  ),
  "invoice-generation": (
    <>
      <circle cx="60" cy="60" r="20" fill={ACCENT} fillOpacity="0.1" />
      <rect x="24" y="18" width="38" height="52" rx="6" stroke={S} strokeWidth="1.6" />
      <path d="M31 30h24 M31 40h24 M31 50h16" stroke={S} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="66" cy="62" r="14" fill="hsl(var(--bg,var(--card)))" stroke={S} strokeWidth="1.6" />
      <path d="M60 62h12 M66 56v12" stroke={S} strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  "quote-generation": (
    <>
      <rect x="20" y="34" width="20" height="26" rx="4" fill={ACCENT} fillOpacity="0.12" />
      <rect x="30" y="16" width="38" height="52" rx="6" stroke={S} strokeWidth="1.6" />
      <path d="M37 28h24 M37 38h24" stroke={S} strokeWidth="1.4" strokeLinecap="round" strokeDasharray="3 4" />
      <path d="M37 48h16" stroke={S} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M60 62l4 4 8-9" stroke={S} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "financial-dashboard": (
    <>
      <rect x="16" y="20" width="64" height="52" rx="8" stroke={S} strokeWidth="1.6" />
      <rect x="26" y="48" width="8" height="14" rx="1.5" fill={ACCENT} fillOpacity="0.35" />
      <rect x="38" y="40" width="8" height="22" rx="1.5" fill={ACCENT} fillOpacity="0.55" />
      <rect x="50" y="32" width="8" height="30" rx="1.5" fill={S} />
      <rect x="62" y="44" width="8" height="18" rx="1.5" fill={ACCENT} fillOpacity="0.35" />
      <path d="M24 30h20" stroke={S} strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  "business-analytics": (
    <>
      <rect x="16" y="18" width="64" height="56" rx="8" stroke={S} strokeWidth="1.6" />
      <path d="M24 58l12-14 10 8 16-20" stroke={S} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M52 32h10v10" stroke={S} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="58" r="2.4" fill={ACCENT} />
      <circle cx="46" cy="52" r="2.4" fill={ACCENT} />
      <circle cx="62" cy="32" r="2.4" fill={ACCENT} />
    </>
  ),
  "client-management": (
    <>
      <circle cx="40" cy="38" r="12" stroke={S} strokeWidth="1.6" />
      <circle cx="58" cy="44" r="9" fill={ACCENT} fillOpacity="0.2" stroke={S} strokeWidth="1.4" />
      <path d="M22 74c2-12 10-18 18-18s16 6 18 18" stroke={S} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M50 74c1.5-9 6-13 12-13s10 4 12 13" stroke={S} strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </>
  ),
  "team-collaboration": (
    <>
      <circle cx="30" cy="30" r="8" stroke={S} strokeWidth="1.6" />
      <circle cx="66" cy="30" r="8" stroke={S} strokeWidth="1.6" />
      <circle cx="48" cy="60" r="9" fill={ACCENT} fillOpacity="0.18" stroke={S} strokeWidth="1.6" />
      <path d="M30 38v10M66 38v10M40 62h-2M48 51v0" stroke={S} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M30 48c0 8 8 8 14 10M66 48c0 8-8 8-14 10" stroke={S} strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </>
  ),
  automation: (
    <>
      <circle cx="48" cy="48" r="14" fill={ACCENT} fillOpacity="0.14" stroke={S} strokeWidth="1.6" />
      <circle cx="48" cy="48" r="4.5" stroke={S} strokeWidth="1.6" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <line
          key={deg}
          x1={48 + 14 * Math.cos((deg * Math.PI) / 180)}
          y1={48 + 14 * Math.sin((deg * Math.PI) / 180)}
          x2={48 + 20 * Math.cos((deg * Math.PI) / 180)}
          y2={48 + 20 * Math.sin((deg * Math.PI) / 180)}
          stroke={S}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      ))}
      <circle cx="24" cy="24" r="2.4" fill={ACCENT} />
      <circle cx="72" cy="72" r="2.4" fill={ACCENT} />
    </>
  ),
  "business-growth": (
    <>
      <rect x="24" y="52" width="9" height="18" rx="1.5" fill={ACCENT} fillOpacity="0.3" />
      <rect x="38" y="42" width="9" height="28" rx="1.5" fill={ACCENT} fillOpacity="0.5" />
      <rect x="52" y="30" width="9" height="40" rx="1.5" fill={S} />
      <path d="M24 34l14-12 10 8 18-16" stroke={S} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M58 14h8v8" stroke={S} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "cloud-infrastructure": (
    <>
      <path
        d="M30 58a12 12 0 010-24 16 16 0 0131-4 11 11 0 019 11 10 10 0 01-2 17z"
        stroke={S}
        strokeWidth="1.6"
        fill={ACCENT}
        fillOpacity="0.1"
      />
      <rect x="38" y="50" width="20" height="16" rx="3" stroke={S} strokeWidth="1.4" fill="hsl(var(--card))" />
      <path d="M42 55h12M42 60h8" stroke={S} strokeWidth="1.2" strokeLinecap="round" />
    </>
  ),
  "cyber-security": (
    <>
      <path
        d="M48 16l24 8v20c0 16-10 26-24 32-14-6-24-16-24-32V24z"
        stroke={S}
        strokeWidth="1.6"
        fill={ACCENT}
        fillOpacity="0.1"
      />
      <path d="M38 48l7 7 14-16" stroke={S} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  "digital-workspace": (
    <>
      <rect x="16" y="24" width="64" height="40" rx="6" stroke={S} strokeWidth="1.6" />
      <path d="M16 34h64" stroke={S} strokeWidth="1.4" />
      <circle cx="24" cy="29" r="1.6" fill={S} />
      <circle cx="30" cy="29" r="1.6" fill={S} />
      <rect x="24" y="42" width="18" height="14" rx="2" fill={ACCENT} fillOpacity="0.25" />
      <path d="M48 42h20M48 48h20M48 54h12" stroke={S} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M36 64l-4 10M60 64l4 10M32 74h32" stroke={S} strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  "smart-reports": (
    <>
      <rect x="22" y="16" width="42" height="56" rx="6" stroke={S} strokeWidth="1.6" />
      <path d="M29 28h28M29 36h28" stroke={S} strokeWidth="1.3" strokeLinecap="round" />
      <rect x="29" y="46" width="10" height="16" fill={ACCENT} fillOpacity="0.35" />
      <rect x="42" y="40" width="10" height="22" fill={ACCENT} fillOpacity="0.55" />
      <path d="M58 20l6 6-6 6" stroke={S} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="70" cy="26" r="2" fill={ACCENT} />
    </>
  ),
  "multi-currency": (
    <>
      <circle cx="38" cy="44" r="18" stroke={S} strokeWidth="1.6" fill="hsl(var(--card))" />
      <circle cx="60" cy="54" r="18" stroke={S} strokeWidth="1.6" fill={ACCENT} fillOpacity="0.12" />
      <path d="M38 36v16M42 39c-1-1.5-2.5-2-4-2-2.5 0-4 1.5-4 3.5S33.5 41 36 41s4 1.5 4 3.5-1.5 3.5-4 3.5c-1.5 0-3-.5-4-2" stroke={S} strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <path d="M56 47v14M65 50h-9M65 54h-9" stroke={S} strokeWidth="1.3" strokeLinecap="round" />
    </>
  ),
  "global-business": (
    <>
      <circle cx="48" cy="48" r="26" stroke={S} strokeWidth="1.6" fill={ACCENT} fillOpacity="0.08" />
      <ellipse cx="48" cy="48" rx="26" ry="10" stroke={S} strokeWidth="1.2" fill="none" />
      <path d="M48 22v52M28 48h40" stroke={S} strokeWidth="1.2" />
      <circle cx="74" cy="34" r="2.4" fill={ACCENT} />
      <circle cx="20" cy="60" r="2.4" fill={ACCENT} />
    </>
  ),
  "payment-processing": (
    <>
      <rect x="16" y="30" width="64" height="42" rx="8" stroke={S} strokeWidth="1.6" fill={ACCENT} fillOpacity="0.08" />
      <path d="M16 42h64" stroke={S} strokeWidth="1.6" />
      <rect x="26" y="54" width="16" height="7" rx="1.5" fill={S} />
      <path d="M52 58l6 6 12-14" stroke={S} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  productivity: (
    <>
      <rect x="22" y="16" width="52" height="64" rx="8" stroke={S} strokeWidth="1.6" />
      <path d="M32 32l4 4 8-8M32 50l4 4 8-8M32 68l4 4 8-8" stroke={S} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M50 30h14M50 48h14M50 66h10" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  "ai-insights": (
    <>
      <path
        d="M48 20c-12 0-20 8-20 18 0 7 3 11 6 14v10a4 4 0 004 4h20a4 4 0 004-4V52c3-3 6-7 6-14 0-10-8-18-20-18z"
        stroke={S}
        strokeWidth="1.6"
        fill={ACCENT}
        fillOpacity="0.1"
      />
      <path d="M40 66h16" stroke={S} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="40" cy="38" r="2.2" fill={ACCENT} />
      <circle cx="56" cy="38" r="2.2" fill={ACCENT} />
      <circle cx="48" cy="30" r="2.2" fill={ACCENT} />
      <path d="M40 38l8-8 8 8" stroke={S} strokeWidth="1.2" fill="none" />
    </>
  ),
};
