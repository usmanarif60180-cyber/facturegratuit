import React, { useMemo } from "react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Trash2, Plus, Zap, FolderPlus, GripVertical } from "lucide-react";
import { partCategories, partTypes, quickServices, buildingCategories, buildingUnits, quickServicesBuilding } from "../../lib/calc";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function LineItemsEditor({ items = [], onChange, activityType, defaultVat = 20, defaultHourlyRate = 60 }) {
  const isRepair = activityType === "repair";
  const isBuilding = activityType === "building";
  const cats = isBuilding ? buildingCategories : partCategories;
  const quickList = isBuilding ? quickServicesBuilding : quickServices;

  const addItem = (base = {}, sectionName = "") => {
    const newItem = {
      id: Math.random().toString(36).slice(2),
      sectionName,
      description: "",
      category: isRepair ? "Pièce" : isBuilding ? "Main-d'œuvre" : "",
      partType: "",
      unit: isBuilding ? "unité" : "",
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

  const addQuick = (q, sectionName = "") => {
    addItem({
      description: q.name,
      category: q.category,
      unit: q.unit || (isBuilding ? "unité" : ""),
      pricingMethod: q.pricingMethod || "fixed",
      unitPrice: q.pricingMethod === "hourly" ? defaultHourlyRate : q.price,
      hours: q.pricingMethod === "hourly" ? 1 : 1,
      partType: q.category === "Pièce" ? "Neuve" : "",
    }, sectionName);
  };

  // Group by section (for building)
  const grouped = useMemo(() => {
    if (!isBuilding) return null;
    const map = new Map();
    (items || []).forEach((it, idx) => {
      const key = it.sectionName || "";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push({ ...it, _idx: idx });
    });
    return Array.from(map.entries()); // [ [sectionName, items[]], ... ]
  }, [items, isBuilding]);

  const addSection = () => {
    const name = window.prompt("Nom de la section / ouvrage :", `Section ${(grouped?.length || 0) + 1}`);
    if (!name) return;
    addItem({ description: "" }, name);
  };
  const renameSection = (oldName) => {
    const name = window.prompt("Nouveau nom :", oldName);
    if (name == null) return;
    onChange(items.map((it) => (it.sectionName === oldName ? { ...it, sectionName: name } : it)));
  };
  const deleteSection = (name) => {
    if (!window.confirm(`Supprimer la section "${name}" et toutes ses lignes ?`)) return;
    onChange(items.filter((it) => (it.sectionName || "") !== name));
  };
  const duplicateSection = (name) => {
    const clones = items.filter((it) => (it.sectionName || "") === name).map((it) => ({ ...it, id: Math.random().toString(36).slice(2), sectionName: `${name} (copie)` }));
    onChange([...items, ...clones]);
  };

  const renderLine = (it, idx) => (
    <div key={it.id || idx} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 grid grid-cols-12 gap-2 items-start bg-neutral-50/50 dark:bg-neutral-950/30">
      <div className={`col-span-12 ${isBuilding ? "md:col-span-4" : "md:col-span-4"}`}>
        <Input value={it.description || ""} onChange={(e) => updateItem(idx, { description: e.target.value })} placeholder="Description" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          {(isRepair || isBuilding) && (
            <Select value={it.category || cats[0]} onValueChange={(v) => updateItem(idx, { category: v })}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{cats.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          )}
          {isRepair && it.category === "Pièce" && (
            <Select value={it.partType || ""} onValueChange={(v) => updateItem(idx, { partType: v })}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>{partTypes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          )}
          {isBuilding && (
            <Select value={it.unit || "unité"} onValueChange={(v) => updateItem(idx, { unit: v })}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{buildingUnits.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
            </Select>
          )}
          {(isRepair && it.category === "Main-d'œuvre") || (isBuilding && it.category === "Main-d'œuvre") ? (
            <Select value={it.pricingMethod || "fixed"} onValueChange={(v) => updateItem(idx, { pricingMethod: v })}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Prix fixe</SelectItem>
                <SelectItem value="hourly">Tarif horaire</SelectItem>
              </SelectContent>
            </Select>
          ) : null}
        </div>
      </div>
      {it.pricingMethod === "hourly" ? (
        <>
          <div className="col-span-4 md:col-span-1">
            <Input type="number" step="0.25" value={it.hours ?? 1} onChange={(e) => updateItem(idx, { hours: Number(e.target.value) })} />
            <div className="text-[10px] text-neutral-500 mt-1">Heures</div>
          </div>
          <div className="col-span-4 md:col-span-2">
            <Input type="number" step="0.01" value={it.unitPrice ?? 0} onChange={(e) => updateItem(idx, { unitPrice: Number(e.target.value) })} />
            <div className="text-[10px] text-neutral-500 mt-1">€ / h</div>
          </div>
        </>
      ) : (
        <>
          <div className="col-span-4 md:col-span-1">
            <Input type="number" step="0.01" value={it.qty ?? 1} onChange={(e) => updateItem(idx, { qty: Number(e.target.value) })} />
            <div className="text-[10px] text-neutral-500 mt-1">Qté{isBuilding && it.unit ? ` (${it.unit})` : ""}</div>
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
  );

  const QuickButton = ({ sectionName = "" }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-lg"><Zap className="h-3.5 w-3.5 mr-1.5 text-amber-500" /> Services rapides</Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-2 max-h-80 overflow-auto">
        <div className="text-xs text-neutral-500 px-2 py-1.5">Cliquer pour ajouter</div>
        <div className="grid grid-cols-1">
          {quickList.map((q) => (
            <button key={q.name} onClick={() => addQuick(q, sectionName)} className="text-left px-2 py-1.5 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950 text-sm flex justify-between items-center">
              <span>{q.name}<span className="ml-1 text-[10px] text-neutral-500">{q.unit ? `· ${q.unit}` : ""}</span></span>
              <span className="text-xs text-neutral-500">{q.pricingMethod === "hourly" ? `${q.price} €/h` : `${q.price} €`}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{isBuilding ? "Ouvrages / Prestations" : activityType === "vehicle_sale" ? "Lignes de vente" : "Lignes de la facture"}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {(isRepair || isBuilding) && <QuickButton />}
          {isBuilding && <Button variant="outline" size="sm" onClick={addSection} className="rounded-lg"><FolderPlus className="h-3.5 w-3.5 mr-1.5" /> Section</Button>}
          <Button size="sm" onClick={() => addItem()} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"><Plus className="h-3.5 w-3.5 mr-1.5" /> Ligne</Button>
        </div>
      </div>

      {isBuilding && grouped ? (
        <div className="space-y-5">
          {grouped.length === 0 && <div className="text-sm text-neutral-500 text-center py-8 border border-dashed rounded-lg">Aucune ligne. Ajoutez une section ou une ligne.</div>}
          {grouped.map(([sectionName, sectionItems]) => {
            const sub = sectionItems.reduce((s, it) => s + ((it.pricingMethod === "hourly" ? Number(it.hours || 0) : Number(it.qty || 0)) * Number(it.unitPrice || 0) - Number(it.discount || 0)), 0);
            return (
              <div key={sectionName || "__default"} className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 bg-white dark:bg-neutral-900">
                {sectionName && (
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-neutral-400" />
                      <button onClick={() => renameSection(sectionName)} className="font-semibold text-neutral-900 dark:text-neutral-100 hover:underline">{sectionName}</button>
                      <span className="text-xs text-neutral-500">Sous-total HT : {sub.toFixed(2)} €</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => addItem({}, sectionName)}><Plus className="h-3.5 w-3.5 mr-1" /> Ligne</Button>
                      <Button size="sm" variant="ghost" onClick={() => duplicateSection(sectionName)}>Dupliquer</Button>
                      <button onClick={() => deleteSection(sectionName)} className="text-rose-500 text-xs px-2">Suppr</button>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  {sectionItems.map((it) => renderLine(it, it._idx))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {(items || []).length === 0 && <div className="text-sm text-neutral-500 text-center py-8 border border-dashed rounded-lg">Aucune ligne. Ajoutez une ligne pour commencer.</div>}
          {(items || []).map((it, idx) => renderLine(it, idx))}
        </div>
      )}
    </div>
  );
}
