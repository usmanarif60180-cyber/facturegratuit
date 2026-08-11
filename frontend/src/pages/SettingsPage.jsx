import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { api } from "../lib/api";
import { toast } from "../hooks/use-toast";
import { Building2, Wrench, FileText } from "lucide-react";

export default function SettingsPage() {
  const [s, setS] = useState(null);
  useEffect(() => { api.getSettings().then(setS); }, []);

  if (!s) return <div className="max-w-4xl mx-auto px-6 py-10">Chargement...</div>;
  const upd = (k, v) => setS({ ...s, [k]: v });

  const save = async () => { await api.saveSettings(s); toast({ title: "Paramètres enregistrés" }); };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold">Paramètres</h1>
      <p className="text-sm text-neutral-500 mt-1">Configuration de l'entreprise et préférences par défaut.</p>

      <div className="grid md:grid-cols-2 gap-5 mt-6">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4"><Building2 className="h-4 w-4 text-indigo-500" /><h3 className="font-semibold">Entreprise</h3></div>
          <div className="space-y-3">
            <div><Label className="text-xs">Nom de l'entreprise</Label><Input value={s.companyName || ""} onChange={(e) => upd("companyName", e.target.value)} /></div>
            <div><Label className="text-xs">Adresse</Label><Input value={s.companyAddress || ""} onChange={(e) => upd("companyAddress", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label className="text-xs">Code postal</Label><Input value={s.companyPostal || ""} onChange={(e) => upd("companyPostal", e.target.value)} /></div>
              <div><Label className="text-xs">Ville</Label><Input value={s.companyCity || ""} onChange={(e) => upd("companyCity", e.target.value)} /></div>
            </div>
            <div><Label className="text-xs">Pays</Label><Input value={s.companyCountry || ""} onChange={(e) => upd("companyCountry", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label className="text-xs">Téléphone</Label><Input value={s.companyPhone || ""} onChange={(e) => upd("companyPhone", e.target.value)} /></div>
              <div><Label className="text-xs">Email</Label><Input value={s.companyEmail || ""} onChange={(e) => upd("companyEmail", e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label className="text-xs">SIRET</Label><Input value={s.siret || ""} onChange={(e) => upd("siret", e.target.value)} /></div>
              <div><Label className="text-xs">N° TVA</Label><Input value={s.vatNumber || ""} onChange={(e) => upd("vatNumber", e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label className="text-xs">IBAN</Label><Input value={s.iban || ""} onChange={(e) => upd("iban", e.target.value)} /></div>
              <div><Label className="text-xs">BIC</Label><Input value={s.bic || ""} onChange={(e) => upd("bic", e.target.value)} /></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4"><Wrench className="h-4 w-4 text-indigo-500" /><h3 className="font-semibold">Automobile / Défauts</h3></div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div><Label className="text-xs">Tarif horaire par défaut (€)</Label><Input type="number" value={s.defaultHourlyRate ?? 60} onChange={(e) => upd("defaultHourlyRate", Number(e.target.value))} /></div>
              <div><Label className="text-xs">TVA par défaut (%)</Label><Input type="number" value={s.defaultVat ?? 20} onChange={(e) => upd("defaultVat", Number(e.target.value))} /></div>
            </div>
            <div><Label className="text-xs">Garantie pièces</Label><Input value={s.partsWarranty || ""} onChange={(e) => upd("partsWarranty", e.target.value)} placeholder="12 mois" /></div>
            <div><Label className="text-xs">Garantie main-d'œuvre</Label><Input value={s.labourWarranty || ""} onChange={(e) => upd("labourWarranty", e.target.value)} placeholder="6 mois" /></div>
            <div className="grid grid-cols-3 gap-2">
              <div><Label className="text-xs">Préfixe factures</Label><Input value={s.invoicePrefix || "FAC"} onChange={(e) => upd("invoicePrefix", e.target.value)} /></div>
              <div><Label className="text-xs">Préfixe devis</Label><Input value={s.quotePrefix || "DEV"} onChange={(e) => upd("quotePrefix", e.target.value)} /></div>
              <div><Label className="text-xs">Préfixe achats</Label><Input value={s.purchasePrefix || "ACH"} onChange={(e) => upd("purchasePrefix", e.target.value)} /></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:col-span-2">
          <div className="flex items-center gap-2 mb-4"><FileText className="h-4 w-4 text-indigo-500" /><h3 className="font-semibold">Textes par défaut</h3></div>
          <div className="grid md:grid-cols-2 gap-3">
            <div><Label className="text-xs">Conditions de paiement</Label><Textarea value={s.defaultTerms || ""} onChange={(e) => upd("defaultTerms", e.target.value)} className="min-h-[100px]" /></div>
            <div><Label className="text-xs">Mentions légales / footer</Label><Textarea value={s.legalFooter || ""} onChange={(e) => upd("legalFooter", e.target.value)} className="min-h-[100px]" placeholder="Capital social, RCS, ..." /></div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={save} className="bg-indigo-600 hover:bg-indigo-700 text-white">Enregistrer</Button>
      </div>
    </div>
  );
}
