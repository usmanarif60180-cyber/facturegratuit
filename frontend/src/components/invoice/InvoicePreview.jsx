import React from "react";
import { computeInvoice, fmt, fmtDate } from "../../lib/calc";

function titleFor(inv) {
  const isQuote = inv.docType === "quote";
  if (isQuote) {
    if (inv.activityType === "repair") return "DEVIS – RÉPARATION AUTOMOBILE";
    if (inv.activityType === "vehicle_sale") return "DEVIS – VENTE DE VÉHICULE";
    return "DEVIS";
  }
  if (inv.activityType === "repair") return "FACTURE – RÉPARATION AUTOMOBILE";
  if (inv.activityType === "vehicle_sale") return "FACTURE – VENTE DE VÉHICULE";
  if (inv.activityType === "vehicle_purchase") return "ACHAT DE VÉHICULE";
  return "FACTURE";
}

function Row({ label, value, bold, primary }) {
  if (value === undefined || value === null || value === 0 || value === "") return null;
  return (
    <div className={`flex justify-between py-1 text-sm ${bold ? "font-semibold" : ""} ${primary ? "text-indigo-700" : "text-neutral-800"}`}>
      <span>{label}</span>
      <span>{typeof value === "number" ? fmt(value, "EUR") : value}</span>
    </div>
  );
}

export default function InvoicePreview({ invoice, settings }) {
  const inv = computeInvoice(invoice || {});
  const s = settings || {};
  const c = inv.clientSnapshot || {};
  const v = inv.vehicleSnapshot || {};
  const seller = inv.sellerSnapshot || {};
  const isPurchase = inv.activityType === "vehicle_purchase";
  const showVehicle = ["repair", "vehicle_sale", "vehicle_purchase"].includes(inv.activityType) && (v.make || v.model || v.registration || v.vin);

  return (
    <div className="invoice-page bg-white text-neutral-900 shadow-xl mx-auto" style={{ width: "210mm", minHeight: "297mm", padding: "16mm" }}>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-bold text-xl text-neutral-900">{s.companyName || "Mon Entreprise"}</div>
          {s.companyAddress && <div className="text-xs text-neutral-600">{s.companyAddress}</div>}
          <div className="text-xs text-neutral-600">{[s.companyPostal, s.companyCity].filter(Boolean).join(" ")}</div>
          {s.companyCountry && <div className="text-xs text-neutral-600">{s.companyCountry}</div>}
          {s.companyPhone && <div className="text-xs text-neutral-600 mt-1">Tél : {s.companyPhone}</div>}
          {s.companyEmail && <div className="text-xs text-neutral-600">{s.companyEmail}</div>}
          {s.siret && <div className="text-xs text-neutral-600 mt-1">SIRET : {s.siret}</div>}
          {s.vatNumber && <div className="text-xs text-neutral-600">TVA : {s.vatNumber}</div>}
        </div>
        <div className="text-right">
          <div className="inline-block px-3 py-1.5 rounded-md bg-indigo-600 text-white text-xs font-semibold tracking-wide">{titleFor(inv)}</div>
          <div className="mt-3 text-sm"><span className="text-neutral-500">N° : </span><span className="font-semibold">{inv.number || "(auto)"}</span></div>
          <div className="text-sm"><span className="text-neutral-500">Date : </span>{fmtDate(inv.issueDate)}</div>
          {inv.dueDate && <div className="text-sm"><span className="text-neutral-500">Échéance : </span>{fmtDate(inv.dueDate)}</div>}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="border border-neutral-200 rounded-lg p-3">
          <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">{isPurchase ? "Vendeur" : "Client"}</div>
          <div className="mt-1 text-sm font-semibold">{isPurchase ? (seller.name || "—") : (c.name || "—")}</div>
          {(isPurchase ? seller.company : c.company) && <div className="text-xs">{isPurchase ? seller.company : c.company}</div>}
          {(isPurchase ? seller.address : c.address) && <div className="text-xs">{isPurchase ? seller.address : c.address}</div>}
          <div className="text-xs">{[isPurchase ? seller.postalCode : c.postalCode, isPurchase ? seller.city : c.city].filter(Boolean).join(" ")}</div>
          {(isPurchase ? seller.country : c.country) && <div className="text-xs">{isPurchase ? seller.country : c.country}</div>}
          {(isPurchase ? seller.phone : c.phone) && <div className="text-xs mt-1">Tél : {isPurchase ? seller.phone : c.phone}</div>}
          {(isPurchase ? seller.email : c.email) && <div className="text-xs">{isPurchase ? seller.email : c.email}</div>}
          {(isPurchase ? seller.siret : c.siret) && <div className="text-xs mt-1">SIRET : {isPurchase ? seller.siret : c.siret}</div>}
          {isPurchase && seller.sellerType && <div className="text-xs mt-1 inline-block px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">{seller.sellerType}</div>}
        </div>

        {showVehicle && (
          <div className="border border-neutral-200 rounded-lg p-3">
            <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">Véhicule</div>
            <div className="mt-1 text-sm font-semibold">{[v.make, v.model, v.version].filter(Boolean).join(" ")}</div>
            {v.registration && <div className="text-xs">Immatriculation : {v.registration}</div>}
            {v.vin && <div className="text-xs">VIN : {v.vin}</div>}
            {v.mileage != null && <div className="text-xs">Kilométrage : {Number(v.mileage).toLocaleString("fr-FR")} km</div>}
            {v.firstRegistrationDate && <div className="text-xs">1ère mise en circulation : {fmtDate(v.firstRegistrationDate)}</div>}
            {v.fuelType && <div className="text-xs">Carburant : {v.fuelType}</div>}
            {v.transmission && <div className="text-xs">Boîte : {v.transmission}</div>}
            {v.color && <div className="text-xs">Couleur : {v.color}</div>}
            {v.fiscalPower && <div className="text-xs">Puissance fiscale : {v.fiscalPower}</div>}
            {v.year && <div className="text-xs">Année : {v.year}</div>}
          </div>
        )}
      </div>

      {/* Line items */}
      {(inv.lineItems || []).length > 0 && (
        <table className="w-full mt-6 text-sm">
          <thead>
            <tr className="text-left border-b-2 border-neutral-800">
              <th className="py-2 pr-2">Description</th>
              <th className="py-2 px-2 text-right w-16">Qté</th>
              <th className="py-2 px-2 text-right w-24">Prix HT</th>
              <th className="py-2 px-2 text-right w-16">TVA</th>
              <th className="py-2 pl-2 text-right w-28">Total HT</th>
            </tr>
          </thead>
          <tbody>
            {inv.lineItems.map((it, i) => (
              <tr key={i} className="border-b border-neutral-100 align-top">
                <td className="py-2 pr-2">
                  <div>{it.description}</div>
                  {inv.activityType === "repair" && (it.category || it.partType || it.pricingMethod === "hourly") && (
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      {it.pricingMethod === "hourly" ? `${Number(it.hours || 0).toFixed(2)} h × ${fmt(it.unitPrice)}/h` : [it.category, it.partType].filter(Boolean).join(" • ")}
                    </div>
                  )}
                </td>
                <td className="py-2 px-2 text-right">{it.pricingMethod === "hourly" ? `${Number(it.hours || 0)} h` : Number(it.qty || 0)}</td>
                <td className="py-2 px-2 text-right">{fmt(it.unitPrice)}</td>
                <td className="py-2 px-2 text-right">{Number(it.vat || 0)}%</td>
                <td className="py-2 pl-2 text-right font-medium">{fmt(it.lineHT)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Totals + works */}
      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="text-xs text-neutral-700 space-y-2">
          {inv.worksPerformed && (
            <div><span className="font-semibold">Travaux effectués :</span><div className="whitespace-pre-line">{inv.worksPerformed}</div></div>
          )}
          {inv.observations && (
            <div><span className="font-semibold">Observations / Recommandations :</span><div className="whitespace-pre-line">{inv.observations}</div></div>
          )}
          {(inv.nextServiceDate || inv.nextServiceMileage) && (
            <div>
              <span className="font-semibold">Prochaine révision :</span>{" "}
              {[inv.nextServiceDate && fmtDate(inv.nextServiceDate), inv.nextServiceMileage && `${Number(inv.nextServiceMileage).toLocaleString("fr-FR")} km`].filter(Boolean).join(" ou ")}
            </div>
          )}
          {inv.notes && <div className="pt-2"><span className="font-semibold">Notes :</span><div className="whitespace-pre-line">{inv.notes}</div></div>}
          {inv.activityType === "vehicle_sale" && inv.taxRegime && inv.taxRegime !== "standard" && (
            <div className="pt-2 italic">Régime de TVA : {inv.taxRegimeWording || inv.taxRegime}</div>
          )}
        </div>

        <div className="border border-neutral-200 rounded-lg p-3">
          <Row label="Sous-total HT" value={inv.subtotalHT} />
          {inv.discount ? <Row label="Remise" value={-Math.abs(inv.discount)} /> : null}
          {inv.fees?.admin ? <Row label="Frais administratifs" value={Number(inv.fees.admin)} /> : null}
          {inv.fees?.delivery ? <Row label="Frais de livraison" value={Number(inv.fees.delivery)} /> : null}
          {inv.fees?.other ? <Row label="Autres frais" value={Number(inv.fees.other)} /> : null}
          <Row label="TVA" value={inv.totalTax} />
          <div className="border-t border-neutral-300 my-1" />
          <Row label="Total TTC" value={inv.totalTTC} bold primary />
          {inv.depositPaid ? <Row label="Acompte versé" value={-Math.abs(inv.depositPaid)} /> : null}
          {inv.alreadyPaid ? <Row label="Déjà payé" value={-Math.abs(inv.alreadyPaid)} /> : null}
          {inv.tradeIn?.enabled ? <Row label="Reprise véhicule" value={-Math.abs(inv.tradeIn.value || 0)} /> : null}
          {(inv.depositPaid || inv.alreadyPaid || inv.tradeIn?.enabled) ? (
            <>
              <div className="border-t border-neutral-300 my-1" />
              <Row label="Reste à payer" value={inv.balanceDue} bold />
            </>
          ) : null}
        </div>
      </div>

      {/* Trade-in details */}
      {inv.tradeIn?.enabled && (
        <div className="mt-4 border border-neutral-200 rounded-lg p-3 text-xs">
          <div className="font-semibold text-neutral-700 mb-1">Reprise du véhicule</div>
          <div className="grid grid-cols-2 gap-1">
            {inv.tradeIn.make && <div>Marque : {inv.tradeIn.make}</div>}
            {inv.tradeIn.model && <div>Modèle : {inv.tradeIn.model}</div>}
            {inv.tradeIn.registration && <div>Immatriculation : {inv.tradeIn.registration}</div>}
            {inv.tradeIn.vin && <div>VIN : {inv.tradeIn.vin}</div>}
            {inv.tradeIn.mileage != null && <div>Kilométrage : {Number(inv.tradeIn.mileage).toLocaleString("fr-FR")} km</div>}
            <div>Valeur : {fmt(inv.tradeIn.value)}</div>
          </div>
        </div>
      )}

      {/* Purchase details */}
      {isPurchase && inv.purchaseInfo && (
        <div className="mt-4 border border-neutral-200 rounded-lg p-3 text-xs">
          <div className="font-semibold text-neutral-700 mb-1">Détails de l'achat</div>
          <div className="grid grid-cols-2 gap-1">
            {inv.purchaseInfo.date && <div>Date d'achat : {fmtDate(inv.purchaseInfo.date)}</div>}
            {inv.purchaseInfo.price != null && <div>Prix d'achat : {fmt(inv.purchaseInfo.price)}</div>}
            {inv.purchaseInfo.method && <div>Mode de paiement : {inv.purchaseInfo.method}</div>}
            {inv.purchaseInfo.reference && <div>Référence : {inv.purchaseInfo.reference}</div>}
            {inv.purchaseInfo.origin && <div>Origine : {inv.purchaseInfo.origin}</div>}
            {inv.purchaseInfo.taxInfo && <div>Note fiscale : {inv.purchaseInfo.taxInfo}</div>}
          </div>
          {inv.purchaseInfo.notes && <div className="mt-2 whitespace-pre-line">{inv.purchaseInfo.notes}</div>}
        </div>
      )}

      {/* Payment info */}
      {(s.iban || s.bic) && !isPurchase && (
        <div className="mt-4 text-xs text-neutral-600">
          <div className="font-semibold text-neutral-700">Coordonnées bancaires</div>
          {s.iban && <div>IBAN : {s.iban}</div>}
          {s.bic && <div>BIC : {s.bic}</div>}
        </div>
      )}

      {(inv.terms || s.defaultTerms) && (
        <div className="mt-4 text-xs text-neutral-600">
          <div className="font-semibold text-neutral-700">Conditions de paiement</div>
          <div className="whitespace-pre-line">{inv.terms || s.defaultTerms}</div>
        </div>
      )}

      {s.legalFooter && (
        <div className="mt-6 pt-3 border-t border-neutral-200 text-[10px] text-neutral-500 text-center whitespace-pre-line">{s.legalFooter}</div>
      )}
    </div>
  );
}
