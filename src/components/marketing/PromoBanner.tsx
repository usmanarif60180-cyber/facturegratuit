import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

interface PromoBannerProps {
  icon?: LucideIcon;
  eyebrow?: string;
  title: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
  variant?: "surface" | "gradient";
}

/** Reusable promotional CTA banner — used across landing pages, blog, resources and tools. */
export function PromoBanner({ icon: Icon, eyebrow, title, description, ctaLabel, ctaHref, variant = "surface" }: PromoBannerProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border p-8 text-center",
        variant === "gradient"
          ? "border-transparent bg-gradient-to-br from-primary to-secondary text-primary-foreground"
          : "border-border bg-surface"
      )}
    >
      {Icon && (
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            variant === "gradient" ? "bg-white/15" : "bg-primary/10 text-primary"
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      )}
      {eyebrow && (
        <span className={cn("text-xs font-semibold uppercase tracking-wide", variant === "gradient" ? "text-white/80" : "text-muted-foreground")}>
          {eyebrow}
        </span>
      )}
      <p className="text-lg font-bold">{title}</p>
      {description && (
        <p className={cn("max-w-md text-sm", variant === "gradient" ? "text-white/85" : "text-muted-foreground")}>
          {description}
        </p>
      )}
      <Link
        href={ctaHref}
        className={cn(
          buttonVariants({ variant: variant === "gradient" ? "outline" : "primary" }),
          "mt-2 gap-2",
          variant === "gradient" && "border-white/40 bg-white/10 text-white hover:bg-white/20"
        )}
      >
        {ctaLabel} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
