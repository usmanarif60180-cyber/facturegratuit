"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import {
  Building2,
  FileSpreadsheet,
  FileText,
  ListTodo,
  Package,
  Receipt,
  Search,
  Users,
} from "lucide-react";
import { useInvoices } from "@/hooks/useInvoices";
import { useQuotes } from "@/hooks/useQuotes";
import { useClients } from "@/hooks/useClients";
import { useProducts } from "@/hooks/useProducts";
import { useExpenses } from "@/hooks/useExpenses";
import { useTasks } from "@/hooks/useTasks";
import { useCompanies } from "@/hooks/useCompanies";
import { cn } from "@/lib/utils/cn";

interface SearchResult {
  id: string;
  kind: string;
  title: string;
  subtitle?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { items: invoices } = useInvoices();
  const { items: quotes } = useQuotes();
  const { items: clients } = useClients();
  const { items: products } = useProducts();
  const { items: expenses } = useExpenses();
  const { items: tasks } = useTasks();
  const { items: companies } = useCompanies();

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    function onOpenEvent() {
      setOpen(true);
    }
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("ivoxa:open-search", onOpenEvent);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("ivoxa:open-search", onOpenEvent);
    };
  }, []);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const results = React.useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const list: SearchResult[] = [];

    for (const inv of invoices) {
      if (inv.number.toLowerCase().includes(q)) {
        list.push({ id: inv.id, kind: "Invoice", title: inv.number, href: `/invoices/${inv.id}`, icon: FileText });
      }
    }
    for (const q2 of quotes) {
      if (q2.number.toLowerCase().includes(q)) {
        list.push({ id: q2.id, kind: "Quote", title: q2.number, href: `/quotes/${q2.id}`, icon: FileSpreadsheet });
      }
    }
    for (const c of clients) {
      if (c.displayName.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)) {
        list.push({ id: c.id, kind: "Client", title: c.displayName, subtitle: c.email, href: `/clients/${c.id}`, icon: Users });
      }
    }
    for (const p of products) {
      if (p.name.toLowerCase().includes(q)) {
        list.push({ id: p.id, kind: "Product", title: p.name, href: `/products`, icon: Package });
      }
    }
    for (const e of expenses) {
      if (e.title.toLowerCase().includes(q)) {
        list.push({ id: e.id, kind: "Expense", title: e.title, href: `/expenses`, icon: Receipt });
      }
    }
    for (const t of tasks) {
      if (t.title.toLowerCase().includes(q)) {
        list.push({ id: t.id, kind: "Task", title: t.title, href: `/tasks`, icon: ListTodo });
      }
    }
    for (const co of companies) {
      if (co.name.toLowerCase().includes(q)) {
        list.push({ id: co.id, kind: "Company", title: co.name, href: `/companies`, icon: Building2 });
      }
    }

    return list.slice(0, 30);
  }, [query, invoices, quotes, clients, products, expenses, tasks, companies]);

  function go(result: SearchResult) {
    setOpen(false);
    router.push(result.href);
  }

  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      go(results[activeIndex]);
    }
  }

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[15vh]" role="dialog" aria-modal="true">
          <m.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
          <m.div
            className="glass relative z-10 w-full max-w-xl overflow-hidden rounded-xl shadow-elevated"
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -4, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Search invoices, quotes, clients, products…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                aria-label="Global search"
              />
              <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
                Esc
              </kbd>
            </div>
            <div className="max-h-80 overflow-y-auto p-1.5">
              {query.trim() === "" ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Search everything — invoices, quotes, clients, products, expenses, tasks, companies.
                </p>
              ) : results.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;.</p>
              ) : (
                results.map((r, i) => (
                  <button
                    key={`${r.kind}-${r.id}`}
                    type="button"
                    onClick={() => go(r)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                      i === activeIndex ? "bg-primary/10" : "hover:bg-muted"
                    )}
                  >
                    <r.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{r.title}</p>
                      {r.subtitle && <p className="truncate text-xs text-muted-foreground">{r.subtitle}</p>}
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{r.kind}</span>
                  </button>
                ))
              )}
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
