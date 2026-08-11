import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Sparkles, TrendingUp, FileText, FileCheck2, Users, Globe, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import AdBanner from "../components/AdBanner";
import { features, steps, templates, pricing } from "../mock";

const iconMap = { FileText, FileCheck2, Users, Sparkles, Globe, ShieldCheck };

const tplColors = [
  "from-indigo-500 to-blue-500",
  "from-sky-500 to-cyan-500",
  "from-rose-500 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-red-500",
  "from-fuchsia-500 to-purple-500",
  "from-violet-500 to-indigo-500",
  "from-lime-500 to-green-500",
  "from-teal-500 to-emerald-500",
  "from-blue-500 to-indigo-500",
  "from-purple-500 to-fuchsia-500",
];

export default function Landing() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-indigo-300/40 blur-3xl dark:bg-indigo-800/20" />
          <div className="absolute top-20 right-0 h-[420px] w-[420px] rounded-full bg-violet-300/40 blur-3xl dark:bg-violet-800/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] [background-size:24px_24px] opacity-40 dark:opacity-10" />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/30">PA</div>
              <Badge variant="secondary" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-widest font-medium bg-white/70 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800">The AI Business Platform</Badge>
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.05]">
              Factures, devis et clients
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">dans un workspace intelligent</span>
            </h1>
            <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
              ProFacture AI réunit factures, devis, clients, PDF A4 et assistant IA dans une interface moderne pour artisans, freelances, auto-entrepreneurs et vendeurs en ligne.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/invoices/new"><Button className="h-11 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25">Créer une facture <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
              <Link to="/dashboard"><Button variant="outline" className="h-11 px-5 rounded-lg border-neutral-300 dark:border-neutral-700">Ouvrir le tableau de bord</Button></Link>
            </div>
          </div>

          {/* Preview card */}
          <div className="relative">
            <div className="absolute -inset-10 bg-gradient-to-tr from-indigo-300/40 via-violet-300/30 to-fuchsia-300/40 blur-3xl rounded-full dark:from-indigo-900/40 dark:via-violet-900/30 dark:to-fuchsia-900/40" />
            <div className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl shadow-indigo-900/10 p-5 w-full max-w-md ml-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600"><span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live</div>
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Revenue this month</div>
              <div className="flex items-baseline gap-2 mt-1">
                <div className="text-3xl font-semibold text-neutral-900 dark:text-neutral-50">€ 12,840</div>
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5"><TrendingUp className="h-3 w-3" /> 18%</span>
              </div>
              <svg viewBox="0 0 320 90" className="w-full mt-3">
                <defs>
                  <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 60 Q40 40 80 50 T160 30 T240 40 T320 20 L320 90 L0 90 Z" fill="url(#g)" />
                <path d="M0 60 Q40 40 80 50 T160 30 T240 40 T320 20" fill="none" stroke="#6366f1" strokeWidth="2" />
              </svg>
              <div className="mt-4 divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
                <div className="flex items-center justify-between py-2">
                  <span className="text-neutral-700 dark:text-neutral-300">INV-0042 · Atlas Studio</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Paid</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-neutral-700 dark:text-neutral-300">INV-0041 · Nova Digital</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Pending</span>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="hidden md:flex absolute -left-6 -top-6 items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg px-3 py-2">
              <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><CheckCircle2 className="h-4 w-4" /></div>
              <div>
                <div className="text-[11px] text-neutral-500">Invoice paid</div>
                <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">$1,240.00</div>
              </div>
            </div>
            <div className="hidden md:flex absolute -right-4 bottom-2 items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg px-3 py-2">
              <div className="h-7 w-7 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center"><Sparkles className="h-4 w-4" /></div>
              <div>
                <div className="text-[11px] text-neutral-500">AI suggestion</div>
                <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Offer a 2% early discount</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AdBanner />

      {/* STEPS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">From details to paid, in four steps</h2>
          <p className="mt-3 text-neutral-500 dark:text-neutral-400">Watch how a business goes from entering details to getting paid.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg hover:shadow-indigo-100/50 dark:hover:shadow-none transition-all">
              <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-semibold">{s.n}</div>
              <h3 className="mt-4 font-semibold text-neutral-900 dark:text-neutral-100">{s.title}</h3>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = iconMap[f.icon];
            return (
              <div key={f.title} className="group relative overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-100/40 dark:hover:shadow-none transition-all">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-semibold text-lg text-neutral-900 dark:text-neutral-100">{f.title}</h3>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <AdBanner />

      {/* TEMPLATES */}
      <section id="templates" className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-3xl mb-10">
          <Badge className="rounded-full px-3 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border border-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-900">Free invoice templates</Badge>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 mt-3">Public templates for real businesses, sellers and freelancers</h2>
          <p className="mt-3 text-neutral-500 dark:text-neutral-400">Create a 100% free invoice or quote for France, UK, USA, Germany, Spain, Italy, building work, vehicle sales, Amazon, eBay, Etsy, Shopify and freelance services.</p>
          <Button variant="outline" className="mt-5 rounded-lg border-neutral-300 dark:border-neutral-700">Browse templates</Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {templates.map((t, i) => (
            <div key={t.title} className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer">
              <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${tplColors[i % tplColors.length]} text-white flex items-center justify-center text-sm font-semibold shadow-md`}>{t.code}</div>
              <h4 className="mt-4 font-semibold text-neutral-900 dark:text-neutral-100">{t.title}</h4>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3">{t.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all">{t.cta} <ArrowRight className="h-3.5 w-3.5" /></div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Free to start. Built to grow with you.</h2>
        <p className="mt-3 text-neutral-500 dark:text-neutral-400">Version 1 is completely free — every core tool, no credit card required.</p>
        <Link to="/invoices/new"><Button className="mt-6 h-11 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25">Créer votre première facture</Button></Link>
      </section>

      <AdBanner />

      {/* PRICING */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Simple, transparent pricing</h2>
          <p className="mt-3 text-neutral-500 dark:text-neutral-400">Start free today. Upgrade only when your business needs more.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {pricing.map((p) => (
            <div key={p.name} className={`relative bg-white dark:bg-neutral-900 border rounded-2xl p-6 flex flex-col ${p.popular ? "border-indigo-500 dark:border-indigo-500 shadow-xl shadow-indigo-500/10 scale-[1.02]" : "border-neutral-200 dark:border-neutral-800"}`}>
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-indigo-600 text-white shadow">Most popular</div>
              )}
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{p.name}</h3>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{p.tagline}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-semibold text-neutral-900 dark:text-neutral-50">{p.price}</span>
                <span className="text-neutral-500">{p.period}</span>
              </div>
              <ul className="mt-5 space-y-2.5 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <Button className={`mt-6 h-10 rounded-lg ${p.popular ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"}`}>{p.cta}</Button>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-10 max-w-2xl mx-auto">ProFacture AI reste gratuit pour créer vos factures et devis. Les offres premium seront activées plus tard, sans paiement aujourd’hui.</p>
      </section>

      <AdBanner />
    </div>
  );
}
