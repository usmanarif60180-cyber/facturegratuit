import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { api } from "../lib/api";
import { toast } from "../hooks/use-toast";
import { chantierStatuses, fmt, fmtDate } from "../lib/calc";
import { HardHat, Plus, Trash2, ExternalLink, FileText } from "lucide-react";

const empty = { name: "", reference: "", address: "", postalCode: "", city: "", contact: "", phone: "", email: "", startDate: "", endDate: "", status: "prospect", budget: 0, notes: "", clientId: null };

export default function ChantiersPage() {
  const [items, setItems] = useState([]);
  const [clients, setClients] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(empty);
  const [detail, setDetail] = useState(null);

  const load = async () => setItems(await api.listChantiers());
  useEffect(() => { load(); api.listClients().then(setClients); }, []);

  const save = async () => {
    if (!editing.name.trim()) { toast({ title: "Nom du chantier requis" }); return; }
    if (editing.id) await api.updateChantier(editing.id, editing);
    else await api.createChantier(editing);
    toast({ title: "Chantier enregistré" });
    setOpen(false); setEditing(empty); load();
  };

  const remove = async (id) => {
    if (!window.confirm("Supprimer ce chantier ?")) return;
    await api.deleteChantier(id); load();
  };

  const openDetail = async (c) => {
    const full = await api.getChantier(c.id);
    setDetail(full);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-semibold flex items-center gap-2"><HardHat className="h-7 w-7 text-amber-500" /> Chantiers</h1>
          <p className="text-sm text-neutral-500 mt-1">Suivez les projets, devis et factures associés.</p>
        </div>
        <Button onClick={() => { setEditing(empty); setOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Plus className="h-4 w-4 mr-1" /> Nouveau chantier</Button>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500">
            <tr><th className="text-left px-4 py-2.5 font-medium">Nom</th><th className="text-left px-3 py-2.5 font-medium">Réf</th><th className="text-left px-3 py-2.5 font-medium">Client</th><th className="text-left px-3 py-2.5 font-medium">Ville</th><th className="text-left px-3 py-2.5 font-medium">Statut</th><th className="text-right px-3 py-2.5 font-medium">Budget</th><th></th></tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {items.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-neutral-500">Aucun chantier.</td></tr>}
            {items.map((c) => {
              const st = chantierStatuses.find(s => s.id === c.status) || chantierStatuses[0];
              const client = clients.find((x) => x.id === c.clientId);
              return (
                <tr key={c.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                  <td className="px-4 py-3 font-medium"><button onClick={() => openDetail(c)} className="text-indigo-600 hover:underline">{c.name}</button></td>
                  <td className="px-3 py-3 text-neutral-500">{c.reference}</td>
                  <td className="px-3 py-3">{client?.name || "—"}</td>
                  <td className="px-3 py-3">{c.city}</td>
                  <td className="px-3 py-3"><span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${st.color}`}>{st.label}</span></td>
                  <td className="px-3 py-3 text-right">{fmt(c.budget)}</td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    <button onClick={() => { setEditing(c); setOpen(true); }} className="h-8 px-2 rounded-md hover:bg-neutral-100 text-xs">Modifier</button>
                    <button onClick={() => remove(c.id)} className="h-8 w-8 rounded-md hover:bg-rose-50 text-rose-500 inline-flex items-center justify-center"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(empty); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader><DialogTitle>{editing.id ? "Modifier le chantier" : "Nouveau chantier"}</DialogTitle></DialogHeader>
          <div className="grid md:grid-cols-2 gap-3">
            <div><Label className="text-xs">Nom du chantier *</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Rénovation appartement" /></div>
            <div><Label className="text-xs">Référence</Label><Input value={editing.reference} onChange={(e) => setEditing({ ...editing, reference: e.target.value })} /></div>
            <div>
              <Label className="text-xs">Client</Label>
              <Select value={editing.clientId || ""} onValueChange={(v) => setEditing({ ...editing, clientId: v })}>
                <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Statut</Label>
              <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{chantierStatuses.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2"><Label className="text-xs">Adresse chantier</Label><Input value={editing.address} onChange={(e) => setEditing({ ...editing, address: e.target.value })} /></div>
            <div><Label className="text-xs">Code postal</Label><Input value={editing.postalCode} onChange={(e) => setEditing({ ...editing, postalCode: e.target.value })} /></div>
            <div><Label className="text-xs">Ville</Label><Input value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })} /></div>
            <div><Label className="text-xs">Contact</Label><Input value={editing.contact} onChange={(e) => setEditing({ ...editing, contact: e.target.value })} /></div>
            <div><Label className="text-xs">Téléphone</Label><Input value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></div>
            <div><Label className="text-xs">Date début prévue</Label><Input type="date" value={editing.startDate || ""} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} /></div>
            <div><Label className="text-xs">Date fin prévue</Label><Input type="date" value={editing.endDate || ""} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} /></div>
            <div><Label className="text-xs">Budget estimé (€)</Label><Input type="number" value={editing.budget || 0} onChange={(e) => setEditing({ ...editing, budget: Number(e.target.value) })} /></div>
            <div className="md:col-span-2"><Label className="text-xs">Notes</Label><Textarea value={editing.notes || ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} className="min-h-[80px]" /></div>
          </div>
          <DialogFooter><Button onClick={save} className="bg-indigo-600 hover:bg-indigo-700 text-white">Enregistrer</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          {detail && (
            <>
              <DialogHeader><DialogTitle>{detail.name}</DialogTitle></DialogHeader>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div><span className="text-neutral-500">Référence :</span> {detail.reference || "—"}</div>
                <div><span className="text-neutral-500">Statut :</span> {chantierStatuses.find(s => s.id === detail.status)?.label}</div>
                <div><span className="text-neutral-500">Adresse :</span> {detail.address}, {detail.postalCode} {detail.city}</div>
                <div><span className="text-neutral-500">Budget :</span> {fmt(detail.budget)}</div>
              </div>
              <div className="mt-5">
                <div className="font-semibold mb-2">Documents liés ({detail.documents?.length || 0})</div>
                {(!detail.documents || detail.documents.length === 0) && <div className="text-sm text-neutral-500">Aucun document. <Link to="/invoices/new" className="text-indigo-600 hover:underline">Créer un devis / facture</Link>.</div>}
                <div className="space-y-2">
                  {(detail.documents || []).map((d) => (
                    <Link key={d.id} to={`/invoices/${d.id}`} className="flex items-center justify-between border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 hover:bg-neutral-50">
                      <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-indigo-500" /><div><div className="font-mono text-sm font-medium text-indigo-600">{d.number}</div><div className="text-xs text-neutral-500">{d.docType} · {fmtDate(d.issueDate)}</div></div></div>
                      <div className="text-right"><div className="font-semibold text-sm">{fmt(d.totalTTC)}</div><ExternalLink className="h-3 w-3 text-neutral-400 ml-auto mt-1" /></div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
