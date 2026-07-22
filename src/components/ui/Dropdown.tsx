"use client";

import * as React from "react";
import { AnimatePresence, m } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

export function Dropdown({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

function useDropdown() {
  const ctx = React.useContext(DropdownContext);
  if (!ctx) throw new Error("Dropdown components must be used within <Dropdown>");
  return ctx;
}

export function DropdownTrigger({
  children,
}: {
  children: React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>;
}) {
  const { open, setOpen } = useDropdown();
  return React.cloneElement(children, {
    onClick: () => setOpen(!open),
    "aria-expanded": open,
    "aria-haspopup": "menu",
  } as React.ButtonHTMLAttributes<HTMLButtonElement>);
}

export function DropdownMenu({
  children,
  align = "end",
}: {
  children: React.ReactNode;
  align?: "start" | "end";
}) {
  const { open } = useDropdown();
  return (
    <AnimatePresence>
      {open && (
        <m.div
          role="menu"
          initial={{ opacity: 0, scale: 0.96, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -4 }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          className={cn(
            "glass absolute z-40 mt-2 min-w-[10rem] rounded-md p-1 text-popover-foreground",
            align === "end" ? "right-0 origin-top-right" : "left-0 origin-top-left"
          )}
        >
          {children}
        </m.div>
      )}
    </AnimatePresence>
  );
}

export function DropdownItem({
  className,
  onSelect,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { onSelect?: () => void }) {
  const { setOpen } = useDropdown();
  return (
    <button
      role="menuitem"
      type="button"
      onClick={(e) => {
        onSelect?.();
        setOpen(false);
        props.onClick?.(e);
      }}
      className={cn(
        "flex w-full items-center gap-2 rounded-sm px-2.5 py-2 text-left text-sm transition-[background-color,transform] duration-100 hover:translate-x-0.5 hover:bg-muted",
        className
      )}
      {...props}
    />
  );
}
