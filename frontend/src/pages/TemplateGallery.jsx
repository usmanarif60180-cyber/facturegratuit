import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent } from "../components/ui/dialog";
import { Search, Heart, Palette, Check } from "lucide-react";
import { templates, templateCategories, defaultTemplateConfig } from "../lib/templates";
import InvoicePreview from "../components/invoice/InvoicePreview";
import { computeInvoice } from "../lib/calc";

const sampleInvoice = (tpl) => ({
  activityType: "building",
  docType: "invoice",
  status: "sent",
  issueDate: "2026-08-11",
  dueDate: "2026-09-10",
  number: "FAC-2026-00125",
  templateConfig: defaultTemplateConfig(tpl),
  companySnapshot: {
    tradeName: "Dupont Bâtiment SARL", legalForm: "SARL", address: "12 rue Example", postalCode: "75000", city: "Paris", country: "France",
    phone: "+33 1 23 45 67 89", email: "contact@dupont-batiment.fr", siret: "12345678900001", vatNumber: "FR12345678900",
    iban: "FR76 3000 4000 0000 0000 0000 189", bic: "BNPAFRPP", bankName: "BNP Paribas",
    accentColor: tpl.palette.primary, logoPosition: "left", logoSize: "medium",
    showStampOn: ["invoice", "quote", "deposit", "final"], defaultTerms: "Paiement à 30 jours net.",
    footer: "SARL au capital de 10 000 € • RCS Paris 123 456 789",
  },
  clientSnapshot: { name: "Jean Martin", address: "45 avenue de la République", postalCode: "75011", city: "Paris" },
  chantierSnapshot: { name: "Rénovation appartement", reference: "CH-001", address: "45 avenue République", postalCode: "75011", city: "Paris" },
  lineItems: [
    { id: "1", sectionName: "Peinture", description: "Peinture murs pièce de vie", category: "Peinture", unit: "m²", qty: 45, unitPrice: 25, vat: 20 },
    { id: "2", sectionName: "Peinture", description: "Peinture plafond", category: "Peinture", unit: "m²", qty: 30, unitPrice: 30, vat: 20 },
    { id: "3", sectionName: "Plomberie", description: "Installation lavabo salle de bain", category: "Plomberie", unit: "pièce", qty: 1, unitPrice: 220, vat: 20 },
    { id: "4", sectionName: "Plomberie", description: "Main-d'œuvre", category: "Main-d'œuvre", pricingMethod: "hourly", hours: 6, unitPrice: 55, vat: 20 },
  ],
  taxRegime: "standard", terms: "Paiement à 30 jours net.",
});

function TemplatePreview({ tpl, scale = 0.22 }) {
  const inv = useMemo(() => computeInvoice(sampleInvoice(tpl)), [tpl]);
  return (
    <div className="pointer-events-none" style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: "210mm" }}>
      <InvoicePreview invoice={inv} settings={{}} />
    </div>
  );
}

export default function TemplateGallery() {
  const nav = useNavigate();
  const [category, setCategory] = useState("Tous");
  const [q, setQ] = useState("");
  const [preview, setPreview] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tplFavorites") || "[]"); } catch { return []; }
  });

  const toggleFav = (id) => {
    const next = favorites.includes(id) ? favorites.filter((x) => x !== id) : [...favorites, id];
    setFavorites(next); localStorage.setItem("tplFavorites", JSON.stringify(next));
  };

  const filtered = templates.filter((t) => (category === "Tous" || t.category === category) && (!q || t.name.toLowerCase().includes(q.toLowerCase())));

  const use = (tpl) => {
    localStorage.setItem("selectedTemplateId", tpl.id);
    nav("/invoices/new");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-semibold flex items-center gap-2"><Palette className="h-7 w-7 text-indigo-500" /> Modèles de documents</h1>
          <p className="text-sm text-neutral-500 mt-1">{templates.length} designs professionnels pour factures, devis, bâtiment et automobile.</p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap mb-5">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un modèle..." className="pl-9" />
        </div>
        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 rounded-full p-1 overflow-x-auto max-w-full">
          {templateCategories.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${category === c ? "bg-white dark:bg-neutral-800 shadow" : "text-neutral-600 dark:text-neutral-300"}`}>{c}</button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((tpl) => (
          <div key={tpl.id} className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
            <div className="relative bg-neutral-100 dark:bg-neutral-950 overflow-hidden" style={{ height: 260 }}>
              <TemplatePreview tpl={tpl} />
              <button onClick={() => toggleFav(tpl.id)} className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white shadow"><Heart className={`h-4 w-4 ${favorites.includes(tpl.id) ? "fill-rose-500 text-rose-500" : "text-neutral-400"}`} /></button>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-neutral-900/40 transition-opacity flex items-center justify-center gap-2">
                <Button size="sm" variant="secondary" onClick={() => setPreview(tpl)}>Aperçu</Button>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => use(tpl)}><Check className="h-3.5 w-3.5 mr-1" /> Utiliser</Button>
              </div>
            </div>
            <div className="p-3">
              <div className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate">{tpl.name}</div>
              <div className="text-[11px] text-neutral-500">{tpl.category}</div>
              <div className="mt-2 flex items-center gap-1">
                {[tpl.palette.primary, tpl.palette.secondary, tpl.palette.accent].map((c, i) => <span key={i} className="h-4 w-4 rounded-full border border-neutral-200" style={{ backgroundColor: c }} />)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-auto">
          {preview && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-lg font-semibold">{preview.name}</div>
                  <div className="text-xs text-neutral-500">{preview.category}</div>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => use(preview)}><Check className="h-4 w-4 mr-1" /> Utiliser ce modèle</Button>
              </div>
              <div className="mx-auto" style={{ width: "210mm", transform: "scale(0.7)", transformOrigin: "top center" }}>
                <InvoicePreview invoice={computeInvoice(sampleInvoice(preview))} settings={{}} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
