import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdBanner from "../components/AdBanner";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";
import { fmt, fmtDate, invoiceStatuses } from "../lib/calc";
import { Sparkles, Plus, FileText, Receipt, Users, Wrench, Car, ShoppingCart, Hammer, TrendingUp, Wallet, DollarSign, ChartBar } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({ revenue: 0, outstanding: 0, invoices: 0, quotes: 0, clients: 0, repairs: 0, sales: 0, purchases: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api.stats().then(setStats);
    api.listInvoices().then((list) => setRecent(list.slice(0, 6)));
  }, []);

  const cards = [
    { label: "Chiffre d'affaires", value: fmt(stats.revenue), icon: DollarSign, tint: "from-emerald-500 to-teal-500" },
    { label: "Restant à encaisser", value: fmt(stats.outstanding), icon: Wallet, tint: "from-amber-500 to-orange-500" },
    { label: "Factures", value: stats.invoices, icon: FileText, tint: "from-indigo-500 to-violet-500" },
    { label: "Devis", value: stats.quotes, icon: Receipt, tint: "from-sky-500 to-cyan-500" },
    { label: "Clients", value: stats.clients, icon: Users, tint: "from-fuchsia-500 to-pink-500" },
    { label: "Réparations", value: stats.repairs, icon: Wrench, tint: "from-rose-500 to-red-500" },
    { label: "Ventes véhicules", value: stats.sales, icon: Car, tint: "from-blue-500 to-indigo-500" },
    { label: "Achats véhicules", value: stats.purchases, icon: ShoppingCart, tint: "from-purple-500 to-fuchsia-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
        <div>
          <h1 className="text-3xl font-semibold">Tableau de bord</h1>
          <p className="mt-1 text-sm text-neutral-500">Un aperçu en temps réel de votre activité.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex items-center gap-3">
            <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${c.tint} text-white flex items-center justify-center shadow-md`}><c.icon className="h-5 w-5" /></div>
            <div>
              <div className="text-xs text-neutral-500">{c.label}</div>
              <div className="font-semibold text-neutral-900 dark:text-neutral-50 text-lg">{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      <AdBanner />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link to="/invoices/new"><div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex items-center gap-3 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-colors">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center"><FileText className="h-4 w-4" /></div>
          <span className="font-medium text-sm">Nouvelle facture</span>
        </div></Link>
        <Link to="/invoices/new"><div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex items-center gap-3 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-colors">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-rose-500 to-red-500 text-white flex items-center justify-center"><Wrench className="h-4 w-4" /></div>
          <span className="font-medium text-sm">Réparation auto</span>
        </div></Link>
        <Link to="/invoices/new"><div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex items-center gap-3 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-colors">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center"><Car className="h-4 w-4" /></div>
          <span className="font-medium text-sm">Vente véhicule</span>
        </div></Link>
        <Link to="/invoices/new"><div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex items-center gap-3 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-colors">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center"><Hammer className="h-4 w-4" /></div>
          <span className="font-medium text-sm">Devis bâtiment</span>
        </div></Link>
        <Link to="/analytics"><div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex items-center gap-3 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-colors">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center"><ChartBar className="h-4 w-4" /></div>
          <span className="font-medium text-sm">Analyse avancée</span>
        </div></Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mt-6">
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-indigo-500" /> Documents récents</h3>
            <Link to="/invoices" className="text-xs text-indigo-600 hover:underline">Voir tout →</Link>
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {recent.length === 0 && <div className="text-sm text-neutral-500 py-6 text-center">Aucun document. <Link to="/invoices/new" className="text-indigo-600 hover:underline">Créer le premier</Link>.</div>}
            {recent.map((i) => {
              const st = invoiceStatuses.find((s) => s.id === i.status) || invoiceStatuses[0];
              return (
                <Link to={`/invoices/${i.id}`} key={i.id} className="flex items-center justify-between py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 -mx-2 px-2 rounded">
                  <div>
                    <div className="font-mono text-sm font-semibold text-indigo-600">{i.number}</div>
                    <div className="text-xs text-neutral-500">{i.clientSnapshot?.name || i.sellerSnapshot?.name || "—"} · {fmtDate(i.issueDate)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">{fmt(i.activityType === "vehicle_purchase" ? (i.purchaseInfo?.price || 0) : i.totalTTC)}</div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${st.color}`}>{st.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-2xl p-5">
          <h3 className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4" /> Démarrer</h3>
          <p className="mt-3 text-sm text-white/90 leading-relaxed">Créez votre première facture standard, réparation auto ou vente de véhicule en quelques clics.</p>
          <Link to="/invoices/new"><Button size="sm" className="mt-4 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur text-white border-0"><Plus className="h-4 w-4 mr-1" /> Nouveau document</Button></Link>
          <Link to="/settings"><Button size="sm" variant="ghost" className="mt-2 rounded-lg text-white/90 hover:bg-white/10">Configurer l'entreprise →</Button></Link>
        </div>
      </div>
    </div>
  );
}
