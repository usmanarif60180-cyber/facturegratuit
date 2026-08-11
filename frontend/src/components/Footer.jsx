import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const cols = [
    { title: "Product", links: [
      { label: "Features", to: "/#features" },
      { label: "Pricing", to: "/#pricing" },
      { label: "Templates", to: "/#templates" },
      { label: "Help Center", to: "/help" },
    ]},
    { title: "Company", links: [
      { label: "About", to: "/#about" },
      { label: "Contact", to: "/contact" },
      { label: "Security", to: "/security" },
    ]},
    { title: "Legal", links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Cookies", to: "/cookies" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Legal Notice", to: "/legal" },
      { label: "Invoice checklist", to: "/checklist" },
    ]},
  ];

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/60">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-semibold text-sm shadow-md shadow-indigo-500/30">PA</div>
            <span className="font-semibold text-neutral-900 dark:text-neutral-50">ProFacture AI</span>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-[220px]">The AI Business Platform — invoicing, quotations and more, in one intelligent workspace.</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3 text-sm">{c.title}</h4>
            <ul className="space-y-2">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-neutral-200 dark:border-neutral-800 py-5 text-center text-xs text-neutral-500 dark:text-neutral-500">© 2026 ProFacture AI. All rights reserved.</div>
    </footer>
  );
}
