import React from "react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Trash2, Plus, Zap } from "lucide-react";
import { partCategories, partTypes, quickServices } from "../../lib/calc";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function LineItemsEditor({ items = [], onChange, activityType, defaultVat = 20, defaultHourlyRate = 60 }) {
  const isRepair = activityType === "repair";

  const addItem = (base = {}) => {
    const newItem = {
      id: Math.random().toString(36).slice(2),
      description: "",
      category: isRepair ? "Pièce" : "",
      partType: "",
      pricingMethod: "fixed",
      qty: 1,
      hours: 1,
      unitPrice: 0,
      vat: defaultVat,
      discount: 0,
      ...base,
    };
    onChange([...(items || []), newItem]);
  };

  const updateItem = (idx, patch) => {
    const next = items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
    onChange(next);
  };
  const removeItem = (idx) => onChange(items.filter((_, i) => i !== idx));

  const addQuick = (q) => {
    addItem({
      description: q.name,
      category: q.category,
      pricingMethod: q.pricingMethod || "fixed",
      unitPrice: q.pricingMethod === "hourly" ? defaultHourlyRate : q.price,
      hours: q.pricingMethod === "hourly" ? 1 : 1,
      partType: q.category === "Pièce" ? "Neuve" : "",
    });
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Lignes {activityType === "vehicle_purchase" ? "d'achat" : activityType === "vehicle_sale" ? "de vente" : "de la facture"}</h3>
        <div className="flex items-center gap-2">
          {isRepair && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-lg"><Zap className="h-3.5 w-3.5 mr-1.5 text-amber-500" /> Services rapides</Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72 p-2 max-h-80 overflow-auto">
                <div className="text-xs text-neutral-500 px-2 py-1.5">Cliquer pour ajouter</div>
                <div className="grid grid-cols-1">
                  {quickServices.map((q) => (
                    <button key={q.name} onClick={() => addQuick(q)} className="text-left px-2 py-1.5 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950 text-sm flex justify-between items-center">
                      <span>{q.name}</span>
                      <span className="text-xs text-neutral-500">{q.pricingMethod === "hourly" ? `${q.price} €/h` : `${q.price} €`}</span>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
          <Button size="sm" onClick={() => addItem()} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"><Plus className="h-3.5 w-3.5 mr-1.5" /> Ligne</Button>
        </div>
      </div>

      <div className="space-y-3">
        {(items || []).length === 0 && (
          <div className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">Aucune ligne. Ajoutez une ligne pour commencer.</div>
        )}
        {(items || []).map((it, idx) => (
          <div key={it.id || idx} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 grid grid-cols-12 gap-2 items-start bg-neutral-50/50 dark:bg-neutral-950/30">
            <div className="col-span-12 md:col-span-4">
              <Input value={it.description || ""} onChange={(e) => updateItem(idx, { description: e.target.value })} placeholder="Description" />
              {isRepair && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Select value={it.category || "Pièce"} onValueChange={(v) => updateItem(idx, { category: v })}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{partCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                  {it.category === "Pièce" && (
                    <Select value={it.partType || ""} onValueChange={(v) => updateItem(idx, { partType: v })}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
                      <SelectContent>{partTypes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  )}
                  {it.category === "Main-d'œuvre" && (
                    <Select value={it.pricingMethod || "fixed"} onValueChange={(v) => updateItem(idx, { pricingMethod: v })}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Prix fixe</SelectItem>
                        <SelectItem value="hourly">Tarif horaire</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}
            </div>
            {it.pricingMethod === "hourly" ? (
              <>
                <div className="col-span-4 md:col-span-1">
                  <Input type="number" step="0.25" value={it.hours ?? 1} onChange={(e) => updateItem(idx, { hours: Number(e.target.value) })} placeholder="Heures" />
                  <div className="text-[10px] text-neutral-500 mt-1">Heures</div>
                </div>
                <div className="col-span-4 md:col-span-2">
                  <Input type="number" step="0.01" value={it.unitPrice ?? 0} onChange={(e) => updateItem(idx, { unitPrice: Number(e.target.value) })} placeholder="Tarif horaire" />
                  <div className="text-[10px] text-neutral-500 mt-1">€ / h</div>
                </div>
              </>
            ) : (
              <>
                <div className="col-span-4 md:col-span-1">
                  <Input type="number" step="0.01" value={it.qty ?? 1} onChange={(e) => updateItem(idx, { qty: Number(e.target.value) })} />
                  <div className="text-[10px] text-neutral-500 mt-1">Qté</div>
                </div>
                <div className="col-span-4 md:col-span-2">
                  <Input type="number" step="0.01" value={it.unitPrice ?? 0} onChange={(e) => updateItem(idx, { unitPrice: Number(e.target.value) })} />
                  <div className="text-[10px] text-neutral-500 mt-1">Prix HT</div>
                </div>
              </>
            )}
            <div className="col-span-4 md:col-span-1">
              <Input type="number" step="0.5" value={it.vat ?? 0} onChange={(e) => updateItem(idx, { vat: Number(e.target.value) })} />
              <div className="text-[10px] text-neutral-500 mt-1">TVA %</div>
            </div>
            <div className="col-span-4 md:col-span-1">
              <Input type="number" step="0.01" value={it.discount ?? 0} onChange={(e) => updateItem(idx, { discount: Number(e.target.value) })} />
              <div className="text-[10px] text-neutral-500 mt-1">Remise</div>
            </div>
            <div className="col-span-4 md:col-span-2 text-right">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100">{((it.pricingMethod === "hourly" ? Number(it.hours || 0) : Number(it.qty || 0)) * Number(it.unitPrice || 0) - Number(it.discount || 0)).toFixed(2)} €</div>
              <div className="text-[10px] text-neutral-500 mt-1">Total HT</div>
            </div>
            <div className="col-span-12 md:col-span-1 flex md:justify-end">
              <button onClick={() => removeItem(idx)} className="h-9 w-9 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 flex items-center justify-center"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
