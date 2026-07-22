import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  className?: string;
  href?: string;
  /** "hero" is a larger mark with a slow AI-motion ring, for the marketing hero moment only. */
  variant?: "default" | "hero";
}

export function Logo({ className, href = "/", variant = "default" }: LogoProps) {
  const isHero = variant === "hero";

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 font-semibold tracking-tight",
        isHero ? "text-2xl" : "text-lg",
        className
      )}
    >
      <span className={cn("relative flex shrink-0 items-center justify-center", isHero ? "h-12 w-12" : "h-8 w-8")}>
        {isHero && (
          <span
            aria-hidden="true"
            className="absolute -inset-1.5 animate-ring-spin rounded-xl opacity-40"
            style={{
              background:
                "conic-gradient(from 0deg, hsl(var(--primary)) 0deg, hsl(var(--secondary)) 120deg, transparent 200deg, hsl(var(--primary)) 360deg)",
              WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 2px))",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 2px))",
            }}
          />
        )}
        <span
          className={cn(
            "relative flex h-full w-full animate-logo-in items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary font-bold text-white",
            isHero ? "text-base" : "text-sm"
          )}
        >
          IX
        </span>
      </span>
      <span>IVOXA</span>
    </Link>
  );
}
