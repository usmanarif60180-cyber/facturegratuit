"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAV, APP_NAV_FOOTER } from "@/config/nav";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils/cn";

function NavLink({ href, label, icon: Icon }: (typeof APP_NAV)[number]) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </Link>
  );
}

export function AppSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface md:flex">
      <div className="flex h-16 items-center px-5">
        <Logo href="/dashboard" />
      </div>
      <nav className="flex-1 space-y-1 px-3" aria-label="Primary">
        {APP_NAV.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </nav>
      <div className="space-y-1 border-t border-border px-3 py-3">
        {APP_NAV_FOOTER.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </div>
    </aside>
  );
}
