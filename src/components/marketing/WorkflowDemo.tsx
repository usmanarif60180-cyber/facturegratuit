"use client";

import * as React from "react";
import { AnimatePresence, m } from "framer-motion";
import { CheckCircle2, FileEdit, Mail, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useInView } from "@/hooks/useInView";

const STEPS = [
  {
    icon: User,
    title: "Enter business info",
    description: "Pick a client, add line items — or let AI draft them from a quick description.",
  },
  {
    icon: Sparkles,
    title: "AI generates the invoice",
    description: "Line items, tax and totals are structured automatically, ready to review.",
  },
  {
    icon: FileEdit,
    title: "Preview & fine-tune",
    description: "A pixel-perfect, client-ready preview — edit anything before it goes out.",
  },
  {
    icon: Mail,
    title: "Send — and track payment",
    description: "Email it in one click, then watch its status move from pending to paid.",
  },
];

const STEP_DURATION = 2800;

export function WorkflowDemo() {
  const reducedMotion = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();
  const [step, setStep] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (reducedMotion || !inView || paused) return;
    const id = setInterval(() => setStep((s) => (s + 1) % STEPS.length), STEP_DURATION);
    return () => clearInterval(id);
  }, [reducedMotion, inView, paused]);

  return (
    <div
      ref={ref}
      className="grid gap-8 lg:grid-cols-[1fr,1.1fr] lg:gap-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="space-y-1">
        {STEPS.map((s, i) => {
          const active = i === step;
          return (
            <button
              key={s.title}
              onClick={() => setStep(i)}
              className="relative flex w-full items-start gap-3.5 rounded-lg p-3.5 text-left"
            >
              {active && (
                <m.span
                  layoutId="workflow-step-active"
                  className="absolute inset-0 rounded-lg border border-border bg-surface"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <span
                className={cn(
                  "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200",
                  active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                <s.icon className="h-4 w-4" />
              </span>
              <div className="relative">
                <p className={cn("text-sm font-semibold", active ? "text-foreground" : "text-muted-foreground")}>
                  {s.title}
                </p>
                {active && <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>}
              </div>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card">
        <WorkflowPreview step={step} />
      </div>
    </div>
  );
}

function WorkflowPreview({ step }: { step: number }) {
  return (
    <div className="relative flex min-h-[16rem] flex-col justify-center">
      <AnimatePresence mode="wait">
        <m.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12, transition: { duration: 0.15 } }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {step === 0 && (
            <div className="space-y-3">
              <div className="h-9 rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted-foreground">
                Client: Atlas Studio
              </div>
              <div className="h-9 rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted-foreground">
                Brand identity package — $1,800.00
              </div>
              <div className="h-9 w-2/3 rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted-foreground/60">
                + Add line item
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col items-center gap-3 text-center">
              <m.span
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="h-5 w-5" />
              </m.span>
              <p className="text-sm font-medium">Structuring line items and totals…</p>
              <div className="flex gap-1.5" aria-hidden="true">
                {[0, 0.2, 0.4].map((delay) => (
                  <m.span
                    key={delay}
                    className="h-1.5 w-1.5 rounded-full bg-primary"
                    animate={{ opacity: [1, 0.3, 1], scale: [1, 0.7, 1] }}
                    transition={{ duration: 1.1, repeat: Infinity, delay, ease: "easeInOut" }}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-lg border border-border bg-surface p-4 text-xs">
              <div className="flex justify-between border-b border-border pb-2 font-semibold">
                <span>Invoice INV-0042</span>
                <span>$1,800.00</span>
              </div>
              <div className="mt-2 space-y-1.5 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Brand identity package</span>
                  <span>$1,800.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center gap-3 text-center">
              <m.span
                className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success"
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <CheckCircle2 className="h-5 w-5" />
              </m.span>
              <p className="text-sm font-medium">Sent to Atlas Studio</p>
              <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">Paid</span>
            </div>
          )}
        </m.div>
      </AnimatePresence>
    </div>
  );
}
