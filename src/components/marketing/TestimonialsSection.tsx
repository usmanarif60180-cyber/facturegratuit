import { MessageSquareQuote } from "lucide-react";

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

/**
 * Ready to render real customer testimonials once we have them
 * (pass `testimonials`). Until then, shows an honest placeholder rather
 * than inventing quotes.
 */
export function TestimonialsSection({ testimonials }: { testimonials?: Testimonial[] }) {
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-14 text-center">
        <MessageSquareQuote className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm font-medium">We&apos;re just getting started</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Customer stories will show up here as more businesses run on IVOXA.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {testimonials.map((t) => (
        <blockquote key={t.name} className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-foreground/90">&ldquo;{t.quote}&rdquo;</p>
          <footer className="mt-3 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{t.name}</span> · {t.role}
          </footer>
        </blockquote>
      ))}
    </div>
  );
}
