import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { fmt } from "../../lib/calc";
import { Percent } from "lucide-react";

export default function SituationDialog({ open, onClose, invoice, onSubmit }) {
  // determine unique sections from source invoice
  const sections = useMemo(() => {
    const set = new Map();
    (invoice?.lineItems || []).forEach((it) => {
      const key = it.sectionName || "";
      if (!set.has(key)) set.set(key, 0);
      const base = (it.pricingMethod === "hourly" ? Number(it.hours || 0) : Number(it.qty || 0)) * Number(it.unitPrice || 0) - Number(it.discount || 0);
      set.set(key, set.get(key) + base);
    });
    return Array.from(set.entries()); // [ [name, sectionTotalHT], ... ]
  }, [invoice]);

  const [progress, setProgress] = useState({});
  useEffect(() => { if (open) setProgress({}); }, [open]);

  const setPct = (name, v) => setProgress((p) => ({ ...p, [name]: Math.max(0, Math.min(100, Number(v || 0))) }));

  const total = sections.reduce((s, [name, subtotal]) => s + (subtotal * (progress[name] || 0)) / 100, 0);

  const submit = async () => {
    const payload = { sectionProgress: progress };
    await onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><Percent className="h-4 w-4 text-indigo-500" /> Facture de situation — % d'avancement par section</DialogTitle></DialogHeader>
        <div className="text-xs text-neutral-500 mb-2">Indiquez le pourcentage d'avancement <em>global</em> atteint pour chaque section. Le montant facturé sera calculé automatiquement en tenant compte des situations précédentes.</div>
        <div className="space-y-2 max-h-96 overflow-auto">
          {sections.length === 0 && <div className="text-sm text-neutral-500 py-4 text-center">Aucune section trouvée sur ce document.</div>}
          {sections.map(([name, subtotal]) => (
            <div key={name || "__d"} className="grid grid-cols-12 gap-3 items-center p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/60">
              <div className="col-span-6"><div className="font-medium text-sm">{name || "(Sans section)"}</div><div className="text-xs text-neutral-500">Total section : {fmt(subtotal)}</div></div>
              <div className="col-span-3"><Input type="number" min="0" max="100" value={progress[name] ?? 0} onChange={(e) => setPct(name, e.target.value)} /></div>
              <div className="col-span-3 text-right font-semibold text-sm">{fmt((subtotal * (progress[name] || 0)) / 100)}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-neutral-200 dark:border-neutral-800 mt-2">
          <div className="text-sm text-neutral-500">Montant HT de cette situation :</div>
          <div className="font-semibold text-lg">{fmt(total)}</div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={submit} className="bg-indigo-600 hover:bg-indigo-700 text-white">Créer la facture de situation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
