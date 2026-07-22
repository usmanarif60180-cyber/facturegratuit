"use client";

import * as React from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { subscribeToNewsletter } from "@/lib/services/newsletterService";
import { cn } from "@/lib/utils/cn";

interface NewsletterSignupProps {
  source: string;
  title?: string;
  description?: string;
  className?: string;
  compact?: boolean;
}

export function NewsletterSignup({
  source,
  title = "Business tips, straight to your inbox",
  description = "One useful email a month — no spam, unsubscribe anytime.",
  className,
  compact,
}: NewsletterSignupProps) {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await subscribeToNewsletter(email, source);
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className={cn("flex items-center gap-2 text-sm font-medium text-success", className)}>
        <CheckCircle2 className="h-4 w-4" /> You&apos;re subscribed — thanks!
      </div>
    );
  }

  return (
    <div className={cn(compact ? "" : "rounded-xl border border-border bg-surface p-6", className)}>
      {!compact && (
        <div className="mb-4 flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" />
          <div>
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2" noValidate>
        <Input
          type="email"
          required
          placeholder="you@business.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address"
        />
        <Button type="submit" loading={loading} className="shrink-0">
          Subscribe
        </Button>
      </form>
    </div>
  );
}
