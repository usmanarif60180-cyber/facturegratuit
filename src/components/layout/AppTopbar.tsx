"use client";

import { useRouter } from "next/navigation";
import { LogOut, Search, Settings, User as UserIcon } from "lucide-react";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { NotificationBell } from "./NotificationBell";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@/components/ui/Dropdown";
import { useAuth } from "@/context/AuthContext";

export function AppTopbar() {
  const { profile, firebaseUser, signOut } = useAuth();
  const router = useRouter();
  const name = profile?.displayName || firebaseUser?.displayName || "Account";

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <MobileNav />
        <div className="hidden md:block">
          <WorkspaceSwitcher />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event("ivoxa:open-search"))}
          className="mr-1 hidden items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground sm:flex"
          aria-label="Open global search"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search…</span>
          <kbd className="rounded border border-border bg-background px-1 text-[10px]">⌘K</kbd>
        </button>
        <NotificationBell />
        <ThemeToggle />
        <Dropdown>
          <DropdownTrigger>
            <button
              className="ml-1 flex items-center gap-2 rounded-md p-1 pr-2 hover:bg-muted"
              aria-label="Account menu"
            >
              <Avatar src={firebaseUser?.photoURL} name={name} size={32} />
            </button>
          </DropdownTrigger>
          <DropdownMenu>
            <div className="px-2.5 py-1.5 text-sm font-medium">{name}</div>
            <div className="mb-1 px-2.5 pb-1.5 text-xs text-muted-foreground">
              {firebaseUser?.email}
            </div>
            <DropdownItem onSelect={() => router.push("/profile")}>
              <UserIcon className="h-4 w-4" /> Profile
            </DropdownItem>
            <DropdownItem onSelect={() => router.push("/settings")}>
              <Settings className="h-4 w-4" /> Settings
            </DropdownItem>
            <DropdownItem
              onSelect={async () => {
                await signOut();
                router.push("/login");
              }}
              className="text-danger"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
}
