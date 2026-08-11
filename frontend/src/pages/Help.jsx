import React from "react";
import AdBanner from "../components/AdBanner";
import { FileText, Receipt, HelpCircle, FileCheck2, Sparkles, Settings, ShieldCheck } from "lucide-react";

export default function Help() {
  const sections = [
    { title: "Invoice Guides", icon: FileText, items: [
      { title: "Creating your first invoice", desc: "A walkthrough of the invoice builder, from client selection to line items." },
      { title: "Understanding invoice statuses", desc: "What draft, pending, paid, overdue and canceled each mean." },
    ]},
    { title: "Tax Basics", icon: Receipt, items: [
      { title: "Setting up tax rates", desc: "How VAT, GST and sales tax rates work on line items." },
      { title: "Exporting invoices as PDF", desc: "Get a client-ready PDF of any invoice or quote." },
    ]},
    { title: "Quotes & Estimates", icon: FileCheck2, items: [
      { title: "Sending a quote", desc: "Turn accepted quotes into invoices in one click." },
      { title: "Quote expiry & follow-ups", desc: "Set validity dates and automated reminders." },
    ]},
    { title: "AI Assistant", icon: Sparkles, items: [
      { title: "Draft invoices with AI", desc: "Describe the work — AI structures line items and totals." },
      { title: "Summarize customer history", desc: "Get quick summaries of any client's activity." },
    ]},
    { title: "Settings & Compliance", icon: Settings, items: [
      { title: "Compliance Center", desc: "Configure country-specific rules, VAT IDs and numbering." },
      { title: "Team & permissions", desc: "Invite members and manage role-based access." },
    ]},
    { title: "Security", icon: ShieldCheck, items: [
      { title: "Account protection", desc: "Passwords, 2FA and trusted devices." },
      { title: "Data handling", desc: "Where your invoice data lives and how it's scoped." },
    ]},
  ];
  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      <div className="text-sm text-neutral-500 mb-2">Home / Help Center</div>
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-3"><HelpCircle className="h-9 w-9 text-indigo-500" /> Help Center</h1>
      <p className="mt-3 text-neutral-500 dark:text-neutral-400">Step-by-step guides for getting the most out of ProFacture AI.</p>

      <AdBanner />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center"><Icon className="h-5 w-5" /></div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{s.title}</h3>
              </div>
              <div className="space-y-3">
                {s.items.map((i) => (
                  <div key={i.title} className="p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors cursor-pointer">
                    <div className="font-medium text-sm text-neutral-900 dark:text-neutral-100">{i.title}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">{i.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
