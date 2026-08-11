import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Plus, Search, FileText, Wrench, Car, ShoppingCart, Trash2, Copy } from "lucide-react";
import { api } from "../lib/api";
import { fmt, fmtDate, invoiceStatuses, purchaseStatuses, activityTypes } from "../lib/calc";
import { toast } from "../hooks/use-toast";

const iconMap = { standard: FileText, repair: Wrench, vehicle_sale: Car, vehicle_purchase: ShoppingCart };

function Badge({ status, activity }) {
  const list = activity === "vehicle_purchase" ? purchaseStatuses : invoiceStatuses;
  const s = list.find((x) => x.id === status) || list[0];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${s.color}`}>{s.label}</span>;
}

export default function InvoicesList() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await api.listInvoices(q);
    setItems(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []); // eslint-disable-line
  useEffect(() => { const t = setTimeout(load, 350); return () => clearTimeout(t); }, [q]); // eslint-disable-line

  const filtered = items.filter((i) => filter === "all" ? true : i.activityType === filter);

  const remove = async (id) => {
    if (!window.confirm("Supprimer ce document ?")) return;
    await api.deleteInvoice(id);
    toast({ title: "Document supprimé" });
    load();
  };
  const duplicate = async (id) => {
    const d = await api.duplicateInvoice(id);
    toast({ title: `Dupliqué : ${d.number}` });
    nav(`/invoices/${d.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div>
          <h1 className="text-3xl font-semibold">Documents</h1>
          <p className="text-sm text-neutral-500 mt-1">Factures, devis, ventes et achats de véhicules.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/invoices/new"><Button className="bg-indigo-600 hover:bg-indigo-700 text-white"><Plus className="h-4 w-4 mr-1" /> Nouveau document</Button></Link>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher n°, client, immatriculation, VIN, marque..." className="pl-9" />
        </div>
        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 rounded-full p-1">
          <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-full text-xs font-medium ${filter === "all" ? "bg-white dark:bg-neutral-800 shadow" : "text-neutral-600 dark:text-neutral-300"}`}>Tous</button>
          {activityTypes.map((t) => (
            <button key={t.id} onClick={() => setFilter(t.id)} className={`px-3 py-1.5 rounded-full text-xs font-medium ${filter === t.id ? "bg-white dark:bg-neutral-800 shadow" : "text-neutral-600 dark:text-neutral-300"}`}>{t.label}</button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium">N°</th>
              <th className="text-left px-3 py-2.5 font-medium">Type</th>
              <th className="text-left px-3 py-2.5 font-medium">Client / Vendeur</th>
              <th className="text-left px-3 py-2.5 font-medium">Véhicule</th>
              <th className="text-left px-3 py-2.5 font-medium">Date</th>
              <th className="text-left px-3 py-2.5 font-medium">Statut</th>
              <th className="text-right px-3 py-2.5 font-medium">Total</th>
              <th className="px-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {loading && <tr><td colSpan={8} className="px-4 py-6 text-center text-neutral-500">Chargement...</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={8} className="px-4 py-10 text-center text-neutral-500">Aucun document. Créez votre premier document.</td></tr>}
            {filtered.map((i) => {
              const Icon = iconMap[i.activityType] || FileText;
              return (
                <tr key={i.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                  <td className="px-4 py-3"><Link to={`/invoices/${i.id}`} className="font-mono font-semibold text-indigo-600 hover:underline">{i.number}</Link></td>
                  <td className="px-3 py-3"><span className="inline-flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300"><Icon className="h-3.5 w-3.5" /> {activityTypes.find(a => a.id === i.activityType)?.label || "—"}</span>{i.docType === "quote" && <span className="ml-1 text-[10px] uppercase text-neutral-500">devis</span>}</td>
                  <td className="px-3 py-3">{i.clientSnapshot?.name || i.sellerSnapshot?.name || "—"}</td>
                  <td className="px-3 py-3 text-neutral-600 dark:text-neutral-400">{i.vehicleSnapshot ? [i.vehicleSnapshot.make, i.vehicleSnapshot.model, i.vehicleSnapshot.registration].filter(Boolean).join(" — ") : "—"}</td>
                  <td className="px-3 py-3 text-neutral-600 dark:text-neutral-400">{fmtDate(i.issueDate)}</td>
                  <td className="px-3 py-3"><Badge status={i.status} activity={i.activityType} /></td>
                  <td className="px-3 py-3 text-right font-semibold">{fmt(i.activityType === "vehicle_purchase" ? (i.purchaseInfo?.price || 0) : i.totalTTC)}</td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    <button onClick={() => duplicate(i.id)} className="h-8 w-8 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 inline-flex items-center justify-center text-neutral-500" title="Dupliquer"><Copy className="h-4 w-4" /></button>
                    <button onClick={() => remove(i.id)} className="h-8 w-8 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950 inline-flex items-center justify-center text-rose-500" title="Supprimer"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
