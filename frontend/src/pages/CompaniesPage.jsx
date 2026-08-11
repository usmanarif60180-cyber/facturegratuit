import React, { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { api } from "../lib/api";
import { toast } from "../hooks/use-toast";
import { Building2, Plus, Trash2, Star, Upload, Image as ImageIcon } from "lucide-react";

const empty = {
  tradeName: "", legalName: "", legalForm: "", siren: "", siret: "", vatNumber: "",
  address: "", addressExtra: "", postalCode: "", city: "", country: "France",
  phone: "", email: "", website: "", capital: "", rcs: "",
  iban: "", bic: "", bankName: "",
  logoBase64: "", stampBase64: "", signatureBase64: "",
  logoPosition: "left", logoSize: "medium",
  showStampOn: ["invoice", "quote", "deposit", "final"],
  accentColor: "#4f46e5",
  footer: "", quoteFooter: "", paymentInstructions: "", defaultTerms: "",
  isDefault: false,
};

function ImageUploader({ label, value, onChange, hint }) {
  const ref = useRef();
  const pick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast({ title: "Image trop lourde (max 2 Mo)" }); return; }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };
  return (
    <div className="border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-xs font-semibold">{label}</div>
          {hint && <div className="text-[11px] text-neutral-500">{hint}</div>}
        </div>
        <div className="flex items-center gap-1">
          <input ref={ref} type="file" accept="image/*" hidden onChange={pick} />
          <Button size="sm" variant="outline" onClick={() => ref.current?.click()}><Upload className="h-3.5 w-3.5 mr-1" /> Choisir</Button>
          {value && <Button size="sm" variant="ghost" onClick={() => onChange("")}><Trash2 className="h-3.5 w-3.5 text-rose-500" /></Button>}
        </div>
      </div>
      <div className="h-24 rounded bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center overflow-hidden">
        {value ? <img src={value} alt="" className="h-full object-contain" /> : <ImageIcon className="h-6 w-6 text-neutral-300" />}
      </div>
    </div>
  );
}

export default function CompaniesPage() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(empty);

  const load = async () => setItems(await api.listCompanies());
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing.tradeName.trim()) { toast({ title: "Nom commercial requis" }); return; }
    if (editing.id) await api.updateCompany(editing.id, editing);
    else await api.createCompany(editing);
    toast({ title: "Société enregistrée" });
    setOpen(false); setEditing(empty); load();
  };

  const remove = async (id) => {
    if (!window.confirm("Supprimer cette société ?")) return;
    await api.deleteCompany(id); load();
  };

  const setDefault = async (c) => { await api.updateCompany(c.id, { ...c, isDefault: true }); load(); };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-semibold flex items-center gap-2"><Building2 className="h-7 w-7 text-indigo-500" /> Mes sociétés</h1>
          <p className="text-sm text-neutral-500 mt-1">Gérez vos entreprises, logo, cachet et signature.</p>
        </div>
        <Button onClick={() => { setEditing(empty); setOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Plus className="h-4 w-4 mr-1" /> Nouvelle société</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 && <div className="col-span-3 text-sm text-neutral-500 text-center py-10 border border-dashed rounded-2xl">Aucune société. Créez la première pour utiliser logo, cachet et signature sur vos documents.</div>}
        {items.map((c) => (
          <div key={c.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {c.logoBase64 ? <img src={c.logoBase64} className="h-10 w-10 object-contain rounded bg-neutral-50" alt="logo" /> : <div className="h-10 w-10 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">{c.tradeName?.[0] || "S"}</div>}
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">{c.tradeName}</div>
                  <div className="text-xs text-neutral-500">{c.city} · {c.siret || "SIRET ?"}</div>
                </div>
              </div>
              {c.isDefault && <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">Défaut</span>}
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-neutral-500">
              {c.stampBase64 && <span className="inline-flex items-center gap-1"><ImageIcon className="h-3 w-3" /> Cachet</span>}
              {c.signatureBase64 && <span className="inline-flex items-center gap-1"><ImageIcon className="h-3 w-3" /> Signature</span>}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => { setEditing(c); setOpen(true); }}>Modifier</Button>
              {!c.isDefault && <Button size="sm" variant="ghost" onClick={() => setDefault(c)}><Star className="h-3.5 w-3.5 mr-1" /> Défaut</Button>}
              <button onClick={() => remove(c.id)} className="ml-auto text-rose-500 hover:bg-rose-50 h-8 w-8 rounded inline-flex items-center justify-center"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(empty); }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader><DialogTitle>{editing.id ? "Modifier la société" : "Nouvelle société"}</DialogTitle></DialogHeader>
          <div className="grid md:grid-cols-2 gap-3">
            <div><Label className="text-xs">Nom commercial *</Label><Input value={editing.tradeName} onChange={(e) => setEditing({ ...editing, tradeName: e.target.value })} /></div>
            <div><Label className="text-xs">Raison sociale</Label><Input value={editing.legalName} onChange={(e) => setEditing({ ...editing, legalName: e.target.value })} /></div>
            <div><Label className="text-xs">Forme juridique</Label><Input value={editing.legalForm} onChange={(e) => setEditing({ ...editing, legalForm: e.target.value })} placeholder="SARL, SAS, EI..." /></div>
            <div><Label className="text-xs">SIREN</Label><Input value={editing.siren} onChange={(e) => setEditing({ ...editing, siren: e.target.value })} /></div>
            <div><Label className="text-xs">SIRET</Label><Input value={editing.siret} onChange={(e) => setEditing({ ...editing, siret: e.target.value })} /></div>
            <div><Label className="text-xs">N° TVA intra</Label><Input value={editing.vatNumber} onChange={(e) => setEditing({ ...editing, vatNumber: e.target.value })} /></div>
            <div className="md:col-span-2"><Label className="text-xs">Adresse</Label><Input value={editing.address} onChange={(e) => setEditing({ ...editing, address: e.target.value })} /></div>
            <div><Label className="text-xs">Complément</Label><Input value={editing.addressExtra} onChange={(e) => setEditing({ ...editing, addressExtra: e.target.value })} /></div>
            <div><Label className="text-xs">Code postal</Label><Input value={editing.postalCode} onChange={(e) => setEditing({ ...editing, postalCode: e.target.value })} /></div>
            <div><Label className="text-xs">Ville</Label><Input value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })} /></div>
            <div><Label className="text-xs">Pays</Label><Input value={editing.country} onChange={(e) => setEditing({ ...editing, country: e.target.value })} /></div>
            <div><Label className="text-xs">Téléphone</Label><Input value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></div>
            <div><Label className="text-xs">Email</Label><Input value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></div>
            <div><Label className="text-xs">Site web</Label><Input value={editing.website} onChange={(e) => setEditing({ ...editing, website: e.target.value })} /></div>
            <div><Label className="text-xs">Capital social</Label><Input value={editing.capital} onChange={(e) => setEditing({ ...editing, capital: e.target.value })} /></div>
            <div><Label className="text-xs">RCS / RM</Label><Input value={editing.rcs} onChange={(e) => setEditing({ ...editing, rcs: e.target.value })} /></div>
            <div><Label className="text-xs">Banque</Label><Input value={editing.bankName} onChange={(e) => setEditing({ ...editing, bankName: e.target.value })} /></div>
            <div><Label className="text-xs">IBAN</Label><Input value={editing.iban} onChange={(e) => setEditing({ ...editing, iban: e.target.value })} /></div>
            <div><Label className="text-xs">BIC</Label><Input value={editing.bic} onChange={(e) => setEditing({ ...editing, bic: e.target.value })} /></div>
          </div>

          <div className="grid md:grid-cols-3 gap-3 mt-3">
            <ImageUploader label="Logo" hint="PNG transparent recommandé" value={editing.logoBase64} onChange={(v) => setEditing({ ...editing, logoBase64: v })} />
            <ImageUploader label="Cachet / Tampon" hint="PNG transparent recommandé" value={editing.stampBase64} onChange={(v) => setEditing({ ...editing, stampBase64: v })} />
            <ImageUploader label="Signature" hint="Image de signature" value={editing.signatureBase64} onChange={(v) => setEditing({ ...editing, signatureBase64: v })} />
          </div>

          <div className="grid md:grid-cols-3 gap-3 mt-3">
            <div>
              <Label className="text-xs">Position du logo</Label>
              <Select value={editing.logoPosition} onValueChange={(v) => setEditing({ ...editing, logoPosition: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="left">Gauche</SelectItem><SelectItem value="center">Centre</SelectItem><SelectItem value="right">Droite</SelectItem></SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Taille du logo</Label>
              <Select value={editing.logoSize} onValueChange={(v) => setEditing({ ...editing, logoSize: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="small">Petit</SelectItem><SelectItem value="medium">Moyen</SelectItem><SelectItem value="large">Grand</SelectItem></SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Couleur d'accent</Label>
              <input type="color" value={editing.accentColor || "#4f46e5"} onChange={(e) => setEditing({ ...editing, accentColor: e.target.value })} className="h-10 w-full rounded border border-neutral-200 dark:border-neutral-800" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3 mt-3">
            <div><Label className="text-xs">Conditions par défaut</Label><Textarea value={editing.defaultTerms} onChange={(e) => setEditing({ ...editing, defaultTerms: e.target.value })} className="min-h-[80px]" /></div>
            <div><Label className="text-xs">Mentions légales / footer</Label><Textarea value={editing.footer} onChange={(e) => setEditing({ ...editing, footer: e.target.value })} className="min-h-[80px]" placeholder="Capital social, RCS, IBAN, ..." /></div>
          </div>

          <DialogFooter className="mt-3">
            <label className="flex items-center gap-2 mr-auto text-sm"><input type="checkbox" checked={!!editing.isDefault} onChange={(e) => setEditing({ ...editing, isDefault: e.target.checked })} /> Définir comme société par défaut</label>
            <Button onClick={save} className="bg-indigo-600 hover:bg-indigo-700 text-white">Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
