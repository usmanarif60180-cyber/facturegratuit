import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { ArrowLeft, Printer, Save, Eye, EyeOff, User, Copy } from "lucide-react";
import ActivityTypeSelector from "../components/invoice/ActivityTypeSelector";
import VehicleForm from "../components/invoice/VehicleForm";
import LineItemsEditor from "../components/invoice/LineItemsEditor";
import InvoicePreview from "../components/invoice/InvoicePreview";
import { api } from "../lib/api";
import { computeInvoice, fmt, taxRegimes, invoiceStatuses, purchaseStatuses, paymentMethods, sellerTypes } from "../lib/calc";
import { toast } from "../hooks/use-toast";

const todayISO = () => new Date().toISOString().slice(0, 10);

const emptyInvoice = () => ({
  activityType: "standard",
  docType: "invoice",
  status: "draft",
  issueDate: todayISO(),
  dueDate: "",
  currency: "EUR",
  clientId: null,
  clientSnapshot: null,
  vehicleId: null,
  vehicleSnapshot: null,
  sellerSnapshot: null,
  lineItems: [],
  taxRegime: "standard",
  taxRegimeWording: "",
  discount: 0,
  depositPaid: 0,
  alreadyPaid: 0,
  fees: { admin: 0, delivery: 0, other: 0 },
  tradeIn: { enabled: false, make: "", model: "", registration: "", vin: "", mileage: null, value: 0 },
  purchaseInfo: { date: todayISO(), price: 0, method: "Virement bancaire", reference: "", origin: "", taxInfo: "", notes: "" },
  notes: "",
  terms: "",
  worksPerformed: "",
  observations: "",
  nextServiceDate: "",
  nextServiceMileage: null,
});

export default function InvoiceEditor() {
  const nav = useNavigate();
  const { id } = useParams();
  const [inv, setInv] = useState(emptyInvoice());
  const [settings, setSettings] = useState({});
  const [clients, setClients] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showPreview, setShowPreview] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const [s, cs] = await Promise.all([api.getSettings(), api.listClients()]);
      setSettings(s);
      setClients(cs);
      if (id) {
        const doc = await api.getInvoice(id);
        setInv({ ...emptyInvoice(), ...doc });
      } else {
        setInv((prev) => ({ ...prev, terms: s.defaultTerms || "" }));
      }
    })();
  }, [id]);

  useEffect(() => {
    if (inv.clientId) api.listVehicles(inv.clientId).then(setVehicles);
    else setVehicles([]);
  }, [inv.clientId]);

  const computed = useMemo(() => computeInvoice(inv), [inv]);
  const upd = (patch) => setInv((prev) => ({ ...prev, ...patch }));

  const pickClient = (cid) => {
    const c = clients.find((x) => x.id === cid);
    upd({ clientId: cid, clientSnapshot: c ? { ...c } : null, vehicleId: null, vehicleSnapshot: null });
  };
  const pickVehicle = (vid) => {
    const v = vehicles.find((x) => x.id === vid);
    upd({ vehicleId: vid, vehicleSnapshot: v ? { ...v } : null });
  };

  const save = async (statusOverride) => {
    setSaving(true);
    try {
      const payload = { ...inv };
      if (statusOverride) payload.status = statusOverride;
      // snapshot current client/vehicle if not already snapped
      if (payload.clientId && !payload.clientSnapshot) {
        const c = clients.find((x) => x.id === payload.clientId);
        if (c) payload.clientSnapshot = { ...c };
      }
      let saved;
      if (id) saved = await api.updateInvoice(id, payload);
      else saved = await api.createInvoice(payload);
      toast({ title: `Document ${saved.number} enregistré` });
      if (!id) nav(`/invoices/${saved.id}`);
      else setInv({ ...emptyInvoice(), ...saved });
    } catch (e) {
      toast({ title: "Erreur", description: e.message });
    } finally {
      setSaving(false);
    }
  };

  const duplicate = async () => {
    if (!id) return;
    const dup = await api.duplicateInvoice(id);
    toast({ title: `Dupliqué : ${dup.number}` });
    nav(`/invoices/${dup.id}`);
  };

  const isRepair = inv.activityType === "repair";
  const isSale = inv.activityType === "vehicle_sale";
  const isPurchase = inv.activityType === "vehicle_purchase";
  const showVehicle = isRepair || isSale || isPurchase;
  const statusList = isPurchase ? purchaseStatuses : invoiceStatuses;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 print:hidden">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => nav("/invoices")}><ArrowLeft className="h-4 w-4 mr-1" /> Retour</Button>
          <div>
            <h1 className="text-2xl font-semibold">{id ? `Édition — ${inv.number || ""}` : "Nouveau document"}</h1>
            <div className="text-xs text-neutral-500">{isPurchase ? "Achat de véhicule" : (inv.docType === "quote" ? "Devis" : "Facture")}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowPreview((v) => !v)}>{showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}{showPreview ? "Masquer" : "Aperçu"}</Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="h-4 w-4 mr-1" /> Imprimer / PDF</Button>
          {id && <Button variant="outline" size="sm" onClick={duplicate}><Copy className="h-4 w-4 mr-1" /> Dupliquer</Button>}
          <Button size="sm" disabled={saving} onClick={() => save()} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Save className="h-4 w-4 mr-1" /> Enregistrer</Button>
        </div>
      </div>

      <div className={`grid ${showPreview ? "xl:grid-cols-[minmax(0,1fr)_minmax(0,650px)]" : "grid-cols-1"} gap-6`}>
        <div className="space-y-5 min-w-0">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
            <div className="font-semibold mb-3">Type d'activité</div>
            <ActivityTypeSelector value={inv.activityType} onChange={(t) => upd({ activityType: t, docType: t === "vehicle_purchase" ? "purchase" : inv.docType === "purchase" ? "invoice" : inv.docType })} />
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 grid md:grid-cols-4 gap-3">
            <div>
              <Label className="text-xs">Type de document</Label>
              <Select value={inv.docType} onValueChange={(v) => upd({ docType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="invoice">Facture</SelectItem>
                  <SelectItem value="quote">Devis</SelectItem>
                  {isPurchase && <SelectItem value="purchase">Achat</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Date d'émission</Label>
              <Input type="date" value={inv.issueDate} onChange={(e) => upd({ issueDate: e.target.value })} />
            </div>
            {!isPurchase && (
              <div>
                <Label className="text-xs">Date d'échéance</Label>
                <Input type="date" value={inv.dueDate || ""} onChange={(e) => upd({ dueDate: e.target.value })} />
              </div>
            )}
            <div>
              <Label className="text-xs">Statut</Label>
              <Select value={inv.status} onValueChange={(v) => upd({ status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{statusList.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          {/* Client OR Seller */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold flex items-center gap-2"><User className="h-4 w-4 text-indigo-500" /> {isPurchase ? "Vendeur" : "Client"}</div>
              {!isPurchase && (
                <Button variant="outline" size="sm" onClick={() => nav("/clients")} className="h-8">Gérer</Button>
              )}
            </div>
            {!isPurchase ? (
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Sélectionner un client</Label>
                  <Select value={inv.clientId || ""} onValueChange={pickClient}>
                    <SelectTrigger><SelectValue placeholder="Choisir un client..." /></SelectTrigger>
                    <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}{c.company ? ` — ${c.company}` : ""}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                {inv.clientSnapshot && (
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 p-3 rounded bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">{inv.clientSnapshot.name}</div>
                    {inv.clientSnapshot.company && <div>{inv.clientSnapshot.company}</div>}
                    <div>{inv.clientSnapshot.address}</div>
                    <div>{[inv.clientSnapshot.postalCode, inv.clientSnapshot.city].filter(Boolean).join(" ")}</div>
                    {inv.clientSnapshot.email && <div>{inv.clientSnapshot.email}</div>}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-3">
                <div><Label className="text-xs">Nom / Raison sociale</Label><Input value={inv.sellerSnapshot?.name || ""} onChange={(e) => upd({ sellerSnapshot: { ...(inv.sellerSnapshot || {}), name: e.target.value } })} /></div>
                <div>
                  <Label className="text-xs">Type de vendeur</Label>
                  <Select value={inv.sellerSnapshot?.sellerType || "Particulier"} onValueChange={(v) => upd({ sellerSnapshot: { ...(inv.sellerSnapshot || {}), sellerType: v } })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{sellerTypes.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs">SIREN / SIRET</Label><Input value={inv.sellerSnapshot?.siret || ""} onChange={(e) => upd({ sellerSnapshot: { ...(inv.sellerSnapshot || {}), siret: e.target.value } })} /></div>
                <div className="md:col-span-2"><Label className="text-xs">Adresse</Label><Input value={inv.sellerSnapshot?.address || ""} onChange={(e) => upd({ sellerSnapshot: { ...(inv.sellerSnapshot || {}), address: e.target.value } })} /></div>
                <div><Label className="text-xs">Ville</Label><Input value={inv.sellerSnapshot?.city || ""} onChange={(e) => upd({ sellerSnapshot: { ...(inv.sellerSnapshot || {}), city: e.target.value } })} /></div>
                <div><Label className="text-xs">Code postal</Label><Input value={inv.sellerSnapshot?.postalCode || ""} onChange={(e) => upd({ sellerSnapshot: { ...(inv.sellerSnapshot || {}), postalCode: e.target.value } })} /></div>
                <div><Label className="text-xs">Téléphone</Label><Input value={inv.sellerSnapshot?.phone || ""} onChange={(e) => upd({ sellerSnapshot: { ...(inv.sellerSnapshot || {}), phone: e.target.value } })} /></div>
                <div><Label className="text-xs">Email</Label><Input value={inv.sellerSnapshot?.email || ""} onChange={(e) => upd({ sellerSnapshot: { ...(inv.sellerSnapshot || {}), email: e.target.value } })} /></div>
              </div>
            )}
          </div>

          {/* Vehicle */}
          {showVehicle && (
            <>
              {!isPurchase && vehicles.length > 0 && (
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
                  <Label className="text-xs">Véhicule du client</Label>
                  <Select value={inv.vehicleId || ""} onValueChange={pickVehicle}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Choisir un véhicule existant" /></SelectTrigger>
                    <SelectContent>{vehicles.map((v) => <SelectItem key={v.id} value={v.id}>{[v.make, v.model, v.registration].filter(Boolean).join(" – ")}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              )}
              <VehicleForm value={inv.vehicleSnapshot || {}} onChange={(v) => upd({ vehicleSnapshot: v })} extended={isSale || isPurchase} title={isPurchase ? "Véhicule acheté" : isSale ? "Véhicule vendu" : "Informations du véhicule"} />
            </>
          )}

          {/* Repair extras */}
          {isRepair && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Travaux effectués</Label>
                <Textarea value={inv.worksPerformed || ""} onChange={(e) => upd({ worksPerformed: e.target.value })} placeholder="Remplacement des plaquettes, vidange moteur..." className="mt-1.5 min-h-[90px]" />
              </div>
              <div>
                <Label className="text-xs">Observations / Recommandations</Label>
                <Textarea value={inv.observations || ""} onChange={(e) => upd({ observations: e.target.value })} placeholder="Prévoir le remplacement des pneus..." className="mt-1.5 min-h-[90px]" />
              </div>
              <div>
                <Label className="text-xs">Prochaine révision — date</Label>
                <Input type="date" value={inv.nextServiceDate || ""} onChange={(e) => upd({ nextServiceDate: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label className="text-xs">Prochaine révision — kilométrage</Label>
                <Input type="number" value={inv.nextServiceMileage ?? ""} onChange={(e) => upd({ nextServiceMileage: e.target.value === "" ? null : Number(e.target.value) })} className="mt-1.5" placeholder="145000" />
              </div>
            </div>
          )}

          {/* Line items (not for purchase) */}
          {!isPurchase && (
            <LineItemsEditor items={inv.lineItems || []} onChange={(items) => upd({ lineItems: items })} activityType={inv.activityType} defaultVat={settings.defaultVat} defaultHourlyRate={settings.defaultHourlyRate} />
          )}

          {/* Vehicle sale extras */}
          {isSale && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 space-y-4">
              <div className="grid md:grid-cols-3 gap-3">
                <div><Label className="text-xs">Frais administratifs</Label><Input type="number" value={inv.fees?.admin || 0} onChange={(e) => upd({ fees: { ...inv.fees, admin: Number(e.target.value) } })} className="mt-1.5" /></div>
                <div><Label className="text-xs">Frais de livraison</Label><Input type="number" value={inv.fees?.delivery || 0} onChange={(e) => upd({ fees: { ...inv.fees, delivery: Number(e.target.value) } })} className="mt-1.5" /></div>
                <div><Label className="text-xs">Autres frais</Label><Input type="number" value={inv.fees?.other || 0} onChange={(e) => upd({ fees: { ...inv.fees, other: Number(e.target.value) } })} className="mt-1.5" /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Régime de TVA</Label>
                  <Select value={inv.taxRegime || "standard"} onValueChange={(v) => upd({ taxRegime: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{taxRegimes.map((t) => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                {(inv.taxRegime === "margin" || inv.taxRegime === "custom" || inv.taxRegime === "exempt") && (
                  <div>
                    <Label className="text-xs">Mention légale sur la facture</Label>
                    <Input value={inv.taxRegimeWording || ""} onChange={(e) => upd({ taxRegimeWording: e.target.value })} className="mt-1.5" placeholder="Ex : TVA sur marge – article 297 A du CGI" />
                  </div>
                )}
              </div>
              {/* Trade-in */}
              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">Reprise d'un véhicule</div>
                  <Switch checked={!!inv.tradeIn?.enabled} onCheckedChange={(v) => upd({ tradeIn: { ...(inv.tradeIn || {}), enabled: v } })} />
                </div>
                {inv.tradeIn?.enabled && (
                  <div className="grid md:grid-cols-3 gap-3 mt-3">
                    <div><Label className="text-xs">Marque</Label><Input value={inv.tradeIn.make || ""} onChange={(e) => upd({ tradeIn: { ...inv.tradeIn, make: e.target.value } })} className="mt-1.5" /></div>
                    <div><Label className="text-xs">Modèle</Label><Input value={inv.tradeIn.model || ""} onChange={(e) => upd({ tradeIn: { ...inv.tradeIn, model: e.target.value } })} className="mt-1.5" /></div>
                    <div><Label className="text-xs">Immatriculation</Label><Input value={inv.tradeIn.registration || ""} onChange={(e) => upd({ tradeIn: { ...inv.tradeIn, registration: e.target.value.toUpperCase() } })} className="mt-1.5" /></div>
                    <div><Label className="text-xs">VIN</Label><Input value={inv.tradeIn.vin || ""} onChange={(e) => upd({ tradeIn: { ...inv.tradeIn, vin: e.target.value.toUpperCase() } })} className="mt-1.5" /></div>
                    <div><Label className="text-xs">Kilométrage</Label><Input type="number" value={inv.tradeIn.mileage ?? ""} onChange={(e) => upd({ tradeIn: { ...inv.tradeIn, mileage: e.target.value === "" ? null : Number(e.target.value) } })} className="mt-1.5" /></div>
                    <div><Label className="text-xs">Valeur de reprise</Label><Input type="number" value={inv.tradeIn.value || 0} onChange={(e) => upd({ tradeIn: { ...inv.tradeIn, value: Number(e.target.value) } })} className="mt-1.5" /></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Purchase details */}
          {isPurchase && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 grid md:grid-cols-3 gap-3">
              <div><Label className="text-xs">Date d'achat</Label><Input type="date" value={inv.purchaseInfo?.date || ""} onChange={(e) => upd({ purchaseInfo: { ...inv.purchaseInfo, date: e.target.value } })} className="mt-1.5" /></div>
              <div><Label className="text-xs">Prix d'achat</Label><Input type="number" value={inv.purchaseInfo?.price || 0} onChange={(e) => upd({ purchaseInfo: { ...inv.purchaseInfo, price: Number(e.target.value) } })} className="mt-1.5" /></div>
              <div>
                <Label className="text-xs">Mode de paiement</Label>
                <Select value={inv.purchaseInfo?.method || "Virement bancaire"} onValueChange={(v) => upd({ purchaseInfo: { ...inv.purchaseInfo, method: v } })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{paymentMethods.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Référence transaction</Label><Input value={inv.purchaseInfo?.reference || ""} onChange={(e) => upd({ purchaseInfo: { ...inv.purchaseInfo, reference: e.target.value } })} className="mt-1.5" /></div>
              <div><Label className="text-xs">Origine du véhicule</Label><Input value={inv.purchaseInfo?.origin || ""} onChange={(e) => upd({ purchaseInfo: { ...inv.purchaseInfo, origin: e.target.value } })} className="mt-1.5" placeholder="Particulier / Enseigne..." /></div>
              <div>
                <Label className="text-xs">Info fiscale</Label>
                <Select value={inv.purchaseInfo?.taxInfo || ""} onValueChange={(v) => upd({ purchaseInfo: { ...inv.purchaseInfo, taxInfo: v } })}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Choisir..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Achat auprès d'un particulier">Achat auprès d'un particulier</SelectItem>
                    <SelectItem value="Achat auprès d'un professionnel">Achat auprès d'un professionnel</SelectItem>
                    <SelectItem value="TVA récupérable">TVA récupérable</SelectItem>
                    <SelectItem value="TVA non récupérable">TVA non récupérable</SelectItem>
                    <SelectItem value="Régime de marge potentiel">Régime de marge potentiel</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-3"><Label className="text-xs">Notes internes</Label><Textarea value={inv.purchaseInfo?.notes || ""} onChange={(e) => upd({ purchaseInfo: { ...inv.purchaseInfo, notes: e.target.value } })} className="mt-1.5 min-h-[70px]" /></div>
            </div>
          )}

          {/* Totals & payments */}
          {!isPurchase && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div><Label className="text-xs">Remise globale (€)</Label><Input type="number" value={inv.discount || 0} onChange={(e) => upd({ discount: Number(e.target.value) })} className="mt-1.5" /></div>
                <div><Label className="text-xs">Acompte versé (€)</Label><Input type="number" value={inv.depositPaid || 0} onChange={(e) => upd({ depositPaid: Number(e.target.value) })} className="mt-1.5" /></div>
                <div><Label className="text-xs">Déjà payé (€)</Label><Input type="number" value={inv.alreadyPaid || 0} onChange={(e) => upd({ alreadyPaid: Number(e.target.value) })} className="mt-1.5" /></div>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-800/40 rounded-lg p-4 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-neutral-600">Sous-total HT</span><span>{fmt(computed.subtotalHT)}</span></div>
                {inv.discount ? <div className="flex justify-between"><span className="text-neutral-600">Remise</span><span>- {fmt(inv.discount)}</span></div> : null}
                <div className="flex justify-between"><span className="text-neutral-600">TVA</span><span>{fmt(computed.totalTax)}</span></div>
                <div className="flex justify-between font-semibold text-indigo-700 border-t border-neutral-200 dark:border-neutral-700 pt-2 mt-2"><span>Total TTC</span><span>{fmt(computed.totalTTC)}</span></div>
                <div className="flex justify-between font-semibold"><span>Reste à payer</span><span>{fmt(computed.balanceDue)}</span></div>
              </div>
            </div>
          )}

          {/* Notes / terms */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 grid md:grid-cols-2 gap-4">
            <div><Label className="text-xs">Notes</Label><Textarea value={inv.notes || ""} onChange={(e) => upd({ notes: e.target.value })} className="mt-1.5 min-h-[80px]" /></div>
            <div><Label className="text-xs">Conditions de paiement</Label><Textarea value={inv.terms || ""} onChange={(e) => upd({ terms: e.target.value })} className="mt-1.5 min-h-[80px]" /></div>
          </div>
        </div>

        {showPreview && (
          <div className="min-w-0">
            <div className="sticky top-20">
              <div className="text-xs text-neutral-500 mb-2">Aperçu A4 — imprimez pour générer le PDF</div>
              <div className="overflow-auto max-h-[80vh] rounded-xl border border-neutral-200 dark:border-neutral-800">
                <div className="origin-top-left scale-[0.62] xl:scale-[0.72]" style={{ width: "210mm" }}>
                  <InvoicePreview invoice={computed} settings={settings} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Print-only preview */}
      <div className="hidden print:block">
        <InvoicePreview invoice={computed} settings={settings} />
      </div>
    </div>
  );
}
