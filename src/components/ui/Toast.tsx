"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useSound } from "@/context/SoundContext";

export type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (input: Omit<Toast, "id">) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastVariant, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLORS: Record<ToastVariant, string> = {
  success: "text-success",
  error: "text-danger",
  warning: "text-warning",
  info: "text-info",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const [mounted, setMounted] = React.useState(false);
  const { play } = useSound();

  React.useEffect(() => setMounted(true), []);

  const toast = React.useCallback(
    (input: Omit<Toast, "id">) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { ...input, id }]);
      if (input.variant === "success") play("success");
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    [play]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {mounted &&
        createPortal(
          <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
            <AnimatePresence initial={false}>
              {toasts.map((t) => {
                const Icon = ICONS[t.variant];
                return (
                  <m.div
                    key={t.id}
                    layout
                    role="status"
                    initial={{ opacity: 0, y: 16, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 40, transition: { duration: 0.15 } }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="glass flex items-start gap-3 rounded-lg p-4"
                  >
                    <Icon
                      className={cn("mt-0.5 h-5 w-5 shrink-0", COLORS[t.variant])}
                      aria-hidden="true"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{t.title}</p>
                      {t.description && (
                        <p className="mt-0.5 text-sm text-muted-foreground">{t.description}</p>
                      )}
                    </div>
                    <button
                      aria-label="Dismiss notification"
                      onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </m.div>
                );
              })}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
