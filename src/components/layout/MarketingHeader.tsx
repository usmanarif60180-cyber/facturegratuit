"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const LINKS = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/tools", label: "Free Tools" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MarketingHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-[width] after:duration-200 hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            Sign in
          </Link>
          <Link href="/register" className={cn(buttonVariants({ variant: "primary", size: "sm" }))}>
            Get started free
          </Link>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <X className="h-5 w-5 animate-scale-in" />
          ) : (
            <Menu className="h-5 w-5 animate-scale-in" />
          )}
        </Button>
      </div>

      {open && (
        <div className="animate-slide-up border-t border-border bg-background px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-4" aria-label="Mobile">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1")}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className={cn(buttonVariants({ variant: "primary", size: "sm" }), "flex-1")}
              >
                Get started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
