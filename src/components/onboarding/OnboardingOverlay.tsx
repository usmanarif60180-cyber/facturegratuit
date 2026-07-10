"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Check, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useOrganization } from "@/hooks/useOrganization";
import { useTheme } from "@/context/ThemeContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { updateUserProfile } from "@/lib/services/userService";
import { updateOrganization } from "@/lib/services/organizationService";
import { CURRENCIES } from "@/lib/constants/currencies";
import { Illustration } from "@/components/illustrations/Illustration";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils/cn";
import type { CurrencyCode } from "@/types";

const STEPS = ["welcome", "workspace", "theme", "ai", "walkthrough", "done"] as const;
type StepId = (typeof STEPS)[number];

const WALKTHROUGH_ITEMS = [
  { variant: "invoice-generation", title: "Create invoices in seconds", body: "Professional invoices with your branding, ready to send." },
  { variant: "quote-generation", title: "Send winning quotes", body: "Turn accepted quotes into invoices with one click." },
  { variant: "smart-reports", title: "Understand your numbers", body: "Revenue, expenses, and conversion tracked automatically." },
  { variant: "global-business", title: "Get paid in any currency", body: "Multi-currency support built in from day one." },
] as const;

export function OnboardingOverlay() {
  const { profile, refreshProfile } = useAuth();
  const { organization } = useOrganization();
  const { theme, setTheme } = useTheme();
  const reducedMotion = useReducedMotion();

  const [mounted, setMounted] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [workspaceName, setWorkspaceName] = React.useState("");
  const [currency, setCurrency] = React.useState<CurrencyCode>("USD");
  const [saving, setSaving] = React.useState(false);
  const seeded = React.useRef(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (organization && !seeded.current) {
      setWorkspaceName(organization.name);
      setCurrency(organization.settings.defaultCurrency);
      seeded.current = true;
    }
  }, [organization]);

  const visible = mounted && !!profile && !profile.onboardingCompletedAt && !dismissed;

  React.useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  const finish = React.useCallback(async () => {
    if (!profile) return;
    setDismissed(true);
    try {
      await updateUserProfile(profile.id, {
        onboardingCompletedAt: new Date().toISOString(),
        themePreference: theme,
      });
      await refreshProfile();
    } catch {
      // Best effort — worst case the overlay resurfaces next session.
    }
  }, [profile, refreshProfile, theme]);

  React.useEffect(() => {
    if (!visible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [visible, finish]);

  if (!visible) return null;

  const stepId: StepId = STEPS[step]!;
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  async function goNext() {
    if (stepId === "workspace" && organization) {
      const nameChanged = workspaceName.trim() && workspaceName.trim() !== organization.name;
      const currencyChanged = currency !== organization.settings.defaultCurrency;
      if (nameChanged || currencyChanged) {
        setSaving(true);
        try {
          await updateOrganization(organization.id, {
            ...(nameChanged ? { name: workspaceName.trim() } : {}),
            settings: { ...organization.settings, defaultCurrency: currency },
          });
        } catch {
          // Non-blocking — user can fix this later in Settings.
        } finally {
          setSaving(false);
        }
      }
    }
    if (isLast) {
      await finish();
    } else {
      setStep((s) => s + 1);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to IVOXA"
    >
      <div
        className="absolute inset-0 animate-fade-in bg-black/50 backdrop-blur-sm"
        onClick={finish}
        aria-hidden="true"
      />

      <div className="glass relative z-10 w-full max-w-xl animate-scale-in overflow-hidden rounded-2xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

        <div className="relative flex items-center justify-between border-b border-border/60 px-6 py-4">
          <div className="flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <span
                key={s}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === step ? "w-6 bg-primary" : i < step ? "w-1.5 bg-primary/50" : "w-1.5 bg-muted"
                )}
              />
            ))}
          </div>
          {!isLast && (
            <button
              onClick={finish}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Skip
            </button>
          )}
        </div>

        <div key={stepId} className={cn("relative px-6 py-8 sm:px-8", !reducedMotion && "animate-fade-in")}>
          {stepId === "welcome" && <WelcomeStep />}
          {stepId === "workspace" && (
            <WorkspaceStep
              name={workspaceName}
              onNameChange={setWorkspaceName}
              currency={currency}
              onCurrencyChange={setCurrency}
            />
          )}
          {stepId === "theme" && <ThemeStep theme={theme} onSelect={setTheme} />}
          {stepId === "ai" && <AiStep />}
          {stepId === "walkthrough" && <WalkthroughStep />}
          {stepId === "done" && <DoneStep reducedMotion={reducedMotion} />}
        </div>

        <div className="relative flex items-center justify-between gap-3 border-t border-border/60 px-6 py-4 sm:px-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className={cn(isFirst && "invisible")}
          >
            Back
          </Button>
          <Button onClick={goNext} loading={saving} className="gap-2">
            {isLast ? (
              "Go to dashboard"
            ) : stepId === "welcome" ? (
              <>
                Get started <Sparkles className="h-4 w-4" />
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function WelcomeStep() {
  return (
    <div className="flex flex-col items-center text-center">
      <Illustration variant="business-growth" size={104} />
      <h2 className="mt-6 text-xl font-semibold">Welcome to IVOXA</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Your AI-powered business platform for invoices, quotes, and growth. Let&rsquo;s set up your
        workspace — it takes less than a minute.
      </p>
    </div>
  );
}

function WorkspaceStep({
  name,
  onNameChange,
  currency,
  onCurrencyChange,
}: {
  name: string;
  onNameChange: (v: string) => void;
  currency: CurrencyCode;
  onCurrencyChange: (v: CurrencyCode) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <Illustration variant="digital-workspace" size={56} framed={false} />
        <div>
          <h2 className="text-lg font-semibold">Set up your workspace</h2>
          <p className="text-sm text-muted-foreground">You can change these anytime in Settings.</p>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="onboarding-workspace-name" className="mb-1.5 block text-sm font-medium">
            Business name
          </label>
          <Input
            id="onboarding-workspace-name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Acme Inc."
          />
        </div>
        <div>
          <label htmlFor="onboarding-currency" className="mb-1.5 block text-sm font-medium">
            Default currency
          </label>
          <Select
            id="onboarding-currency"
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}

function ThemeStep({ theme, onSelect }: { theme: "light" | "dark" | "system"; onSelect: (t: "light" | "dark" | "system") => void }) {
  const options: { value: "light" | "dark" | "system"; label: string }[] = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ];
  return (
    <div>
      <h2 className="text-lg font-semibold">Choose your look</h2>
      <p className="mt-1 text-sm text-muted-foreground">You can switch anytime from the top bar.</p>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-150 hover:-translate-y-0.5",
              theme === opt.value ? "border-primary bg-primary/5 shadow-subtle" : "border-border"
            )}
          >
            <span
              className={cn(
                "flex h-10 w-14 items-center justify-center rounded-md border",
                opt.value === "dark" && "border-white/10 bg-slate-900",
                opt.value === "light" && "border-black/5 bg-white",
                opt.value === "system" && "bg-gradient-to-br from-white to-slate-900"
              )}
            >
              {theme === opt.value && (
                <Check
                  className={cn("h-4 w-4", opt.value === "dark" ? "text-white" : "text-slate-900")}
                />
              )}
            </span>
            <span className="text-xs font-medium">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function AiStep() {
  return (
    <div className="flex flex-col items-center text-center">
      <Illustration variant="ai-assistant" size={104} />
      <h2 className="mt-6 text-xl font-semibold">Meet your AI assistant</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        IVOXA&rsquo;s AI drafts invoices, follows up on late payments, and summarizes your business
        performance — so you spend less time on admin.
      </p>
    </div>
  );
}

function WalkthroughStep() {
  return (
    <div>
      <h2 className="text-center text-lg font-semibold">Everything you need</h2>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {WALKTHROUGH_ITEMS.map((item) => (
          <div key={item.variant} className="rounded-xl border border-border p-3">
            <Illustration variant={item.variant} size={44} framed={false} />
            <p className="mt-2 text-sm font-medium">{item.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DoneStep({ reducedMotion }: { reducedMotion: boolean }) {
  const confetti = React.useMemo(
    () =>
      reducedMotion
        ? []
        : Array.from({ length: 10 }, (_, i) => ({
            left: 8 + ((i * 37) % 84),
            delay: (i % 5) * 0.09,
            hue: i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--secondary))",
          })),
    [reducedMotion]
  );

  return (
    <div className="relative flex flex-col items-center text-center">
      {confetti.length > 0 && (
        <div className="pointer-events-none absolute inset-x-0 -top-2 h-24 overflow-hidden" aria-hidden="true">
          {confetti.map((c, i) => (
            <span
              key={i}
              className="absolute top-0 h-2 w-2 animate-confetti-fall rounded-sm"
              style={{ left: `${c.left}%`, backgroundColor: c.hue, animationDelay: `${c.delay}s` }}
            />
          ))}
        </div>
      )}
      <div className={cn("flex h-16 w-16 items-center justify-center rounded-full bg-primary/10", !reducedMotion && "animate-pop-in")}>
        <Check className="h-8 w-8 text-primary" />
      </div>
      <h2 className="mt-6 text-xl font-semibold">You&rsquo;re all set!</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Your workspace is ready. Let&rsquo;s create your first invoice or quote.
      </p>
    </div>
  );
}
