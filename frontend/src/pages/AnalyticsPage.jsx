import React, { useEffect, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { api } from "../lib/api";
import { fmt } from "../lib/calc";
import { TrendingUp, Wallet, DollarSign, FileCheck2, Users, AlertTriangle, ChartBar } from "lucide-react";

const activityLabels = { standard: "Standard", repair: "Réparation", vehicle_sale: "Vente véhicule", vehicle_purchase: "Achat véhicule", building: "Bâtiment" };
const activityColors = { standard: "#4f46e5", repair: "#f43f5e", vehicle_sale: "#3b82f6", vehicle_purchase: "#a855f7", building: "#f59e0b" };

function Card({ label, value, sub, icon: Icon, tint = "from-indigo-500 to-violet-500" }) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${tint} text-white flex items-center justify-center shadow-md`}><Icon className="h-5 w-5" /></div>
        <div>
          <div className="text-xs text-neutral-500">{label}</div>
          <div className="font-semibold text-lg text-neutral-900 dark:text-neutral-50">{value}</div>
          {sub && <div className="text-[11px] text-neutral-500">{sub}</div>}
        </div>
      </div>
    </div>
  );
}

function MonthlyChart({ data, accent = "#4f46e5" }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const w = 640, h = 180, pad = 24;
  const points = data.map((d, i) => {
    const x = pad + (i * (w - pad * 2)) / (data.length - 1 || 1);
    const y = h - pad - (d.value / max) * (h - pad * 2);
    return { x, y, d };
  });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
  const area = `${path} L${points[points.length - 1]?.x || 0} ${h - pad} L${points[0]?.x || 0} ${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs><linearGradient id="ag" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={accent} stopOpacity="0.35" /><stop offset="100%" stopColor={accent} stopOpacity="0" /></linearGradient></defs>
      <path d={area} fill="url(#ag)" />
      <path d={path} fill="none" stroke={accent} strokeWidth="2.5" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={3} fill={accent} />
          <text x={p.x} y={h - 6} fontSize="9" textAnchor="middle" fill="#737373">{p.d.label}</text>
        </g>
      ))}
    </svg>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("year");
  const [companyId, setCompanyId] = useState("all");
  const [companies, setCompanies] = useState([]);
  const [data, setData] = useState(null);

  useEffect(() => { api.listCompanies().then(setCompanies); }, []);
  useEffect(() => { api.analytics({ period, companyId }).then(setData); }, [period, companyId]);

  const activityTotal = useMemo(() => Object.values(data?.byActivity || {}).reduce((s, v) => s + v, 0) || 1, [data]);

  if (!data) return <div className="max-w-7xl mx-auto px-6 py-10">Chargement...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-semibold flex items-center gap-2"><ChartBar className="h-7 w-7 text-indigo-500" /> Analyse avancée</h1>
          <p className="text-sm text-neutral-500 mt-1">Vos indicateurs métier calculés à partir de vos vraies données.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={companyId} onValueChange={setCompanyId}>
            <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les sociétés</SelectItem>
              {companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.tradeName}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 jours</SelectItem>
              <SelectItem value="30">30 jours</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card label="CA HT" value={fmt(data.revenueHT)} icon={DollarSign} tint="from-emerald-500 to-teal-500" />
        <Card label="CA TTC" value={fmt(data.revenueTTC)} icon={TrendingUp} tint="from-indigo-500 to-violet-500" />
        <Card label="Encaissé" value={fmt(data.paid)} icon={Wallet} tint="from-sky-500 to-blue-500" />
        <Card label="Restant à encaisser" value={fmt(data.outstanding)} icon={AlertTriangle} tint="from-amber-500 to-orange-500" />
        <Card label="TVA facturée" value={fmt(data.vat)} icon={FileCheck2} tint="from-rose-500 to-pink-500" />
        <Card label="Factures" value={data.invoiceCount} icon={FileCheck2} tint="from-fuchsia-500 to-purple-500" />
        <Card label="Devis" value={data.quoteCount} sub={`Acceptation ${data.quoteAcceptanceRate}%`} icon={FileCheck2} tint="from-cyan-500 to-sky-500" />
        <Card label="Top clients" value={data.topClients.length} icon={Users} tint="from-emerald-500 to-green-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mt-6">
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Chiffre d'affaires — 12 derniers mois</h3>
            <div className="text-xs text-neutral-500">TTC</div>
          </div>
          <MonthlyChart data={data.monthly} />
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
          <h3 className="font-semibold mb-3">Par activité</h3>
          <div className="space-y-2">
            {Object.entries(data.byActivity).length === 0 && <div className="text-sm text-neutral-500">Pas encore de données.</div>}
            {Object.entries(data.byActivity).map(([k, v]) => (
              <div key={k}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium">{activityLabels[k] || k}</span>
                  <span>{fmt(v)}</span>
                </div>
                <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.round((v / activityTotal) * 100)}%`, backgroundColor: activityColors[k] || "#4f46e5" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
          <h3 className="font-semibold mb-3">Devis</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-emerald-700">Acceptés</span><span className="font-semibold">{fmt(data.quoteAccepted)}</span></div>
            <div className="flex justify-between"><span className="text-amber-700">En attente</span><span className="font-semibold">{fmt(data.quotePending)}</span></div>
            <div className="flex justify-between"><span className="text-rose-700">Refusés</span><span className="font-semibold">{fmt(data.quoteRejected)}</span></div>
            <div className="mt-2 pt-2 border-t flex justify-between font-semibold"><span>Taux d'acceptation</span><span>{data.quoteAcceptanceRate}%</span></div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
          <h3 className="font-semibold mb-3">Top clients</h3>
          {data.topClients.length === 0 && <div className="text-sm text-neutral-500">Aucune donnée client.</div>}
          <div className="space-y-2">
            {data.topClients.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-semibold">{i + 1}</div>
                  <div><div className="font-medium text-sm">{c.name}</div><div className="text-xs text-neutral-500">{c.count} facture(s)</div></div>
                </div>
                <div className="font-semibold">{fmt(c.revenue)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
          <h3 className="font-semibold mb-3">Retards de paiement</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>À venir</span><span className="font-semibold">{fmt(data.aging.soon)}</span></div>
            <div className="flex justify-between"><span>1–7 jours</span><span className="font-semibold text-amber-700">{fmt(data.aging["1_7"])}</span></div>
            <div className="flex justify-between"><span>8–30 jours</span><span className="font-semibold text-orange-700">{fmt(data.aging["8_30"])}</span></div>
            <div className="flex justify-between"><span>31–60 jours</span><span className="font-semibold text-rose-700">{fmt(data.aging["31_60"])}</span></div>
            <div className="flex justify-between"><span>60+ jours</span><span className="font-semibold text-red-700">{fmt(data.aging["60_plus"])}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
