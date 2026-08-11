// Central calculation engine (mirrors backend logic)
export function computeInvoice(inv) {
  const items = (inv.lineItems || []).map((it) => {
    const qty = it.pricingMethod === "hourly" ? Number(it.hours || 0) : Number(it.qty || 0);
    const unit = Number(it.unitPrice || 0);
    const disc = Number(it.discount || 0);
    const lineHT = Math.max(qty * unit - disc, 0);
    const vat = Number(it.vat || 0);
    const lineTax = lineHT * (vat / 100);
    return { ...it, lineHT, lineTax, lineTTC: lineHT + lineTax };
  });
  const subtotalHT = items.reduce((s, i) => s + i.lineHT, 0);
  const globalDisc = Number(inv.discount || 0);
  const fees = inv.fees || {};
  const feesTotal = Object.values(fees).reduce((s, v) => s + Number(v || 0), 0);
  let totalTax = items.reduce((s, i) => s + i.lineTax, 0);
  if (["exempt", "na", "margin"].includes(inv.taxRegime)) totalTax = 0;
  const afterDisc = Math.max(subtotalHT - globalDisc, 0) + feesTotal;
  const totalTTC = afterDisc + totalTax;
  const deposit = Number(inv.depositPaid || 0);
  const already = Number(inv.alreadyPaid || 0);
  const tradeIn = inv.tradeIn && inv.tradeIn.enabled ? Number(inv.tradeIn.value || 0) : 0;
  const balanceDue = Math.max(totalTTC - deposit - already - tradeIn, 0);
  return { ...inv, lineItems: items, subtotalHT, totalTax, totalTTC, balanceDue };
}

export function fmt(n, currency = "EUR") {
  const v = Number(n || 0);
  try {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(v);
  } catch {
    return `${v.toFixed(2)} €`;
  }
}

export function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso.length <= 10 ? iso + "T00:00:00" : iso);
  if (isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

export const activityTypes = [
  { id: "standard", label: "Facture standard", desc: "Facture classique services / produits", icon: "FileText" },
  { id: "repair", label: "Réparation automobile", desc: "Garage, mécanique, carrosserie", icon: "Wrench" },
  { id: "vehicle_sale", label: "Vente de véhicule", desc: "Vente d'un véhicule à un client", icon: "Car" },
  { id: "vehicle_purchase", label: "Achat de véhicule", desc: "Achat auprès d'un vendeur", icon: "ShoppingCart" },
];

export const partCategories = ["Pièce", "Main-d'œuvre", "Diagnostic", "Carrosserie", "Peinture", "Pneumatique", "Électricité", "Entretien", "Autre"];
export const partTypes = ["Neuve", "Occasion", "Échange standard", "Reconditionnée"];
export const fuelTypes = ["Essence", "Diesel", "Hybride", "Électrique", "GPL", "E85", "Autre"];
export const transmissions = ["Manuelle", "Automatique", "Semi-automatique"];
export const paymentMethods = ["Virement bancaire", "Espèces", "Chèque", "Carte", "Financement", "Autre"];
export const sellerTypes = ["Particulier", "Professionnel", "Société", "Autre"];
export const taxRegimes = [
  { id: "standard", label: "TVA standard" },
  { id: "margin", label: "TVA sur marge" },
  { id: "exempt", label: "Exonération de TVA" },
  { id: "na", label: "TVA non applicable" },
  { id: "custom", label: "Personnalisé" },
];
export const invoiceStatuses = [
  { id: "draft", label: "Brouillon", color: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300" },
  { id: "sent", label: "Envoyée", color: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300" },
  { id: "partial", label: "Partiellement payée", color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  { id: "paid", label: "Payée", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  { id: "overdue", label: "En retard", color: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300" },
  { id: "cancelled", label: "Annulée", color: "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400" },
];
export const purchaseStatuses = [
  { id: "draft", label: "Brouillon", color: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300" },
  { id: "confirmed", label: "Confirmé", color: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300" },
  { id: "paid", label: "Payé", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  { id: "cancelled", label: "Annulé", color: "bg-neutral-200 text-neutral-600" },
];

export const quickServices = [
  { name: "Vidange moteur", category: "Entretien", price: 25 },
  { name: "Filtre à huile", category: "Pièce", price: 15 },
  { name: "Filtre à air", category: "Pièce", price: 20 },
  { name: "Filtre habitacle", category: "Pièce", price: 18 },
  { name: "Plaquettes de frein", category: "Pièce", price: 45 },
  { name: "Disques de frein", category: "Pièce", price: 80 },
  { name: "Diagnostic électronique", category: "Diagnostic", price: 60 },
  { name: "Batterie", category: "Pièce", price: 120 },
  { name: "Pneumatiques", category: "Pneumatique", price: 90 },
  { name: "Embrayage", category: "Pièce", price: 350 },
  { name: "Distribution", category: "Pièce", price: 280 },
  { name: "Alternateur", category: "Électricité", price: 220 },
  { name: "Démarreur", category: "Électricité", price: 190 },
  { name: "Révision", category: "Entretien", price: 130 },
  { name: "Recharge climatisation", category: "Entretien", price: 70 },
  { name: "Géométrie", category: "Entretien", price: 80 },
  { name: "Main-d'œuvre", category: "Main-d'œuvre", price: 60, pricingMethod: "hourly" },
  { name: "Peinture", category: "Peinture", price: 250 },
  { name: "Carrosserie", category: "Carrosserie", price: 200 },
];
