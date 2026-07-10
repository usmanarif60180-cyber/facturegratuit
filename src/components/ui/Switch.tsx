"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function Switch({ checked, onChange, disabled, className, ...aria }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-muted",
        className
      )}
      {...aria}
    >
      <span
        className={cn(
          "inline-block h-[1.125rem] w-[1.125rem] translate-x-1 rounded-full bg-white shadow-subtle transition-transform duration-150 ease-out",
          checked && "translate-x-[1.125rem]"
        )}
      />
    </button>
  );
}
