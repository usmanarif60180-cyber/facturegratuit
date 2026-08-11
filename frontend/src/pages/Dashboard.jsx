import React from "react";
import AdBanner from "../components/AdBanner";
import { Button } from "../components/ui/button";
import { dashboardStats } from "../mock";
import * as Icons from "lucide-react";
import { Sparkles, Plus, FileText, Receipt, Users, Package, Settings2, Bell, CheckSquare, Calendar, TrendingUp, Boxes, ShieldAlert } from "lucide-react";
import { Badge } from "../components/ui/badge";

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Your Business — A snapshot of your business, in real time.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live
          </div>
          <Button variant="outline" size="sm" className="rounded-lg"><Settings2 className="h-3.5 w-3.5 mr-1.5" /> Customize</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {dashboardStats.map((s) => {
          const Icon = Icons[s.icon] || Icons.Circle;
          return (
            <div key={s.label} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center"><Icon className="h-5 w-5" /></div>
              <div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">{s.label}</div>
                <div className="font-semibold text-neutral-900 dark:text-neutral-50">{s.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      <AdBanner />

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { i: FileText, l: "New invoice" },
          { i: Receipt, l: "New quote" },
          { i: Users, l: "Add client" },
          { i: Package, l: "Add product" },
        ].map(({ i: Icon, l }) => (
          <button key={l} className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex items-center gap-3 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-colors">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center"><Icon className="h-4 w-4" /></div>
            <span className="font-medium text-sm text-neutral-800 dark:text-neutral-200">+ {l}</span>
          </button>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-5 mt-6">
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-indigo-500" /> Revenue</h3>
            <div className="text-xs text-neutral-500">Last 12 months</div>
          </div>
          <svg viewBox="0 0 600 200" className="w-full">
            <defs>
              <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 140 Q60 100 120 120 T240 80 T360 100 T480 60 T600 90 L600 200 L0 200 Z" fill="url(#g2)" />
            <path d="M0 140 Q60 100 120 120 T240 80 T360 100 T480 60 T600 90" fill="none" stroke="#6366f1" strokeWidth="2.5" />
          </svg>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2"><Boxes className="h-4 w-4 text-indigo-500" /> CRM pipeline</h3>
          <div className="mt-4 space-y-3">
            {["New", "Qualified", "Proposal"].map((s) => (
              <div key={s} className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">{s}</span>
                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">0</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2"><CheckSquare className="h-4 w-4 text-indigo-500" /> Tasks due</h3>
          <div className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">No tasks due today.</div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2"><Calendar className="h-4 w-4 text-indigo-500" /> Calendar</h3>
          <div className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">Nothing scheduled.</div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-2xl p-5">
          <h3 className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4" /> AI Insights</h3>
          <p className="mt-3 text-sm text-white/90 leading-relaxed">Add invoices, expenses and clients to see AI insights here.</p>
          <Button size="sm" className="mt-4 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur text-white border-0">Ask the AI Assistant →</Button>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-amber-500" /> Compliance</h3>
          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">0 of 4 enabled countries fully compliant</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["🇫🇷 France", "🇮🇹 Italy", "🇪🇸 Spain", "🇩🇪 Germany"].map((c) => (
              <Badge key={c} variant="secondary" className="rounded-full text-[11px]">{c}</Badge>
            ))}
          </div>
          <a className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline cursor-pointer">Open Compliance Center →</a>
        </div>
      </div>

      <AdBanner />
    </div>
  );
}
