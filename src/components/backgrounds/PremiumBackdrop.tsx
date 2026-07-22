/**
 * Ambient background layers for hero/CTA moments — mesh gradient, grain,
 * grid and glow orbs. Each is pure CSS/SVG (no images, no JS), absolutely
 * positioned behind content with pointer-events disabled, and kept subtle
 * enough to never compete with foreground text.
 */

export function MeshGradient({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(40% 50% at 15% 20%, hsl(var(--primary) / 0.16), transparent 60%)," +
          "radial-gradient(35% 45% at 85% 15%, hsl(var(--secondary) / 0.14), transparent 60%)," +
          "radial-gradient(50% 60% at 50% 100%, hsl(var(--primary) / 0.08), transparent 65%)",
      }}
    />
  );
}

export function GridOverlay({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "linear-gradient(hsl(var(--foreground) / 0.05) 1px, transparent 1px)," +
          "linear-gradient(90deg, hsl(var(--foreground) / 0.05) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 90%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 90%)",
      }}
    />
  );
}

export function NoiseOverlay({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", opacity: 0.05 }}
    >
      <filter id="ivoxa-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#ivoxa-noise)" />
    </svg>
  );
}

export function GlowOrbs({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        className="animate-float"
        style={{
          position: "absolute",
          top: "-6rem",
          right: "-4rem",
          width: "18rem",
          height: "18rem",
          borderRadius: "9999px",
          background: "hsl(var(--primary) / 0.18)",
          filter: "blur(70px)",
        }}
      />
      <div
        className="animate-float-delayed"
        style={{
          position: "absolute",
          bottom: "-8rem",
          left: "-6rem",
          width: "20rem",
          height: "20rem",
          borderRadius: "9999px",
          background: "hsl(var(--secondary) / 0.16)",
          filter: "blur(80px)",
        }}
      />
    </div>
  );
}

/** Composes all four layers — drop into a `relative` section as the first child. */
export function PremiumBackdrop({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className} style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
      <MeshGradient />
      <GlowOrbs />
      <GridOverlay />
      <NoiseOverlay />
    </div>
  );
}
