import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function BottomNav() {
  const items = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/invoices", label: "Factures" },
    { to: "/chantiers", label: "Chantiers" },
    { to: "/clients", label: "Clients" },
    { to: "/analytics", label: "Analyse" },
    { to: "/companies", label: "Sociétés" },
  ];
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-lg shadow-neutral-900/5 dark:shadow-black/40 px-1.5 py-1.5">
        {items.map((i) => (
          <NavLink key={i.to} to={i.to} end={i.to === "/"} className={({ isActive }) => `px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${isActive ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>{i.label}</NavLink>
        ))}
        <Link to="/invoices/new" className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-500 to-violet-600 text-white flex items-center gap-1.5">
          <Sparkles className="h-3 w-3" /> Nouveau
        </Link>
      </div>
    </div>
  );
}
