import React from "react";
import { computeInvoice, fmt, fmtDate } from "../../lib/calc";

function titleFor(inv) {
  const dt = inv.docType;
  if (dt === "quote") {
    if (inv.activityType === "repair") return "DEVIS – RÉPARATION AUTOMOBILE";
    if (inv.activityType === "vehicle_sale") return "DEVIS – VENTE DE VÉHICULE";
    if (inv.activityType === "building") return "DEVIS – TRAVAUX / BÂTIMENT";
    return "DEVIS";
  }
  if (dt === "deposit") return "FACTURE D'ACOMPTE";
  if (dt === "final") return "FACTURE FINALE";
  if (dt === "credit") return "AVOIR";
  if (inv.activityType === "repair") return "FACTURE – RÉPARATION AUTOMOBILE";
  if (inv.activityType === "vehicle_sale") return "FACTURE – VENTE DE VÉHICULE";
  if (inv.activityType === "vehicle_purchase") return "ACHAT DE VÉHICULE";
  if (inv.activityType === "building") return "FACTURE – TRAVAUX / BÂTIMENT";
  return "FACTURE";
}

function Row({ label, value, bold, primary, color }) {
  if (value === undefined || value === null || value === 0 || value === "") return null;
  return (
    <div className={`flex justify-between py-1 text-sm ${bold ? "font-semibold" : ""}`} style={primary ? { color } : {}}>
      <span>{label}</span>
      <span>{typeof value === "number" ? fmt(value, "EUR") : value}</span>
    </div>
  );
}

function CompanyHeader({ company, accent }) {
  if (!company) return null;
  return (
    <div>
      <div className="font-bold text-xl text-neutral-900">{company.tradeName || company.legalName || "Ma Société"}</div>
      {company.legalName && company.legalName !== company.tradeName && <div className="text-xs text-neutral-600">{company.legalForm} {company.legalName}</div>}
      {company.address && <div className="text-xs text-neutral-600">{company.address}</div>}
      {company.addressExtra && <div className="text-xs text-neutral-600">{company.addressExtra}</div>}
      <div className="text-xs text-neutral-600">{[company.postalCode, company.city].filter(Boolean).join(" ")}</div>
      {company.country && <div className="text-xs text-neutral-600">{company.country}</div>}
      {(company.phone || company.email) && <div className="text-xs text-neutral-600 mt-1">{[company.phone && `Tél : ${company.phone}`, company.email].filter(Boolean).join(" · ")}</div>}
      {company.website && <div className="text-xs" style={{ color: accent }}>{company.website}</div>}
      {(company.siret || company.siren) && <div className="text-xs text-neutral-600 mt-1">{company.siret ? `SIRET : ${company.siret}` : `SIREN : ${company.siren}`}</div>}
      {company.vatNumber && <div className="text-xs text-neutral-600">TVA : {company.vatNumber}</div>}
      {company.rcs && <div className="text-xs text-neutral-600">{company.rcs}</div>}
    </div>
  );
}

export default function InvoicePreview({ invoice, settings }) {
  const inv = computeInvoice(invoice || {});
  const s = settings || {};
  const company = inv.companySnapshot || null;
  // fallback company from settings if no company snapshot
  const legacyCompany = !company ? {
    tradeName: s.companyName, address: s.companyAddress, city: s.companyCity, postalCode: s.companyPostal, country: s.companyCountry,
    phone: s.companyPhone, email: s.companyEmail, siret: s.siret, vatNumber: s.vatNumber, iban: s.iban, bic: s.bic,
    logoBase64: "", stampBase64: "", signatureBase64: "", accentColor: "#4f46e5", logoPosition: "left", logoSize: "medium",
    showStampOn: ["invoice", "quote", "deposit", "final"],
  } : null;
  const co = company || legacyCompany;
  const accent = co?.accentColor || "#4f46e5";
  const c = inv.clientSnapshot || {};
  const v = inv.vehicleSnapshot || {};
  const seller = inv.sellerSnapshot || {};
  const chantier = inv.chantierSnapshot || {};
  const isPurchase = inv.activityType === "vehicle_purchase";
  const isBuilding = inv.activityType === "building";
  const showVehicle = ["repair", "vehicle_sale", "vehicle_purchase"].includes(inv.activityType) && (v.make || v.model || v.registration || v.vin);
  const showChantier = isBuilding && (chantier.name || chantier.address || chantier.reference);
  const showStamp = co?.stampBase64 && (co.showStampOn || []).includes(inv.docType || "invoice");
  const logoSizes = { small: 44, medium: 64, large: 84 };
  const logoH = logoSizes[co?.logoSize || "medium"] || 64;
  const logoPos = co?.logoPosition || "left";

  // group building items by section
  const groups = isBuilding
    ? Array.from((inv.lineItems || []).reduce((m, it) => { const k = it.sectionName || ""; if (!m.has(k)) m.set(k, []); m.get(k).push(it); return m; }, new Map()).entries())
    : null;

  return (
    <div className="invoice-page bg-white text-neutral-900 shadow-xl mx-auto" style={{ width: "210mm", minHeight: "297mm", padding: "16mm" }}>
      {/* Logo row */}
      {co?.logoBase64 && (
        <div className={`mb-4 flex ${logoPos === "center" ? "justify-center" : logoPos === "right" ? "justify-end" : "justify-start"}`}>
          <img src={co.logoBase64} alt="logo" style={{ height: logoH, maxWidth: "60%", objectFit: "contain" }} />
        </div>
      )}

      <div className="flex justify-between items-start">
        <CompanyHeader company={co} accent={accent} />
        <div className="text-right">
          <div className="inline-block px-3 py-1.5 rounded-md text-white text-xs font-semibold tracking-wide" style={{ backgroundColor: accent }}>{titleFor(inv)}</div>
          <div className="mt-3 text-sm"><span className="text-neutral-500">N° : </span><span className="font-semibold">{inv.number || "(auto)"}</span></div>
          <div className="text-sm"><span className="text-neutral-500">Date : </span>{fmtDate(inv.issueDate)}</div>
          {inv.docType === "quote" && inv.validityDate && <div className="text-sm"><span className="text-neutral-500">Validité : </span>{fmtDate(inv.validityDate)}</div>}
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

        {(showVehicle || showChantier) && (
          <div className="border border-neutral-200 rounded-lg p-3">
            {showVehicle ? (
              <>
                <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">Véhicule</div>
                <div className="mt-1 text-sm font-semibold">{[v.make, v.model, v.version].filter(Boolean).join(" ")}</div>
                {v.registration && <div className="text-xs">Immatriculation : {v.registration}</div>}
                {v.vin && <div className="text-xs">VIN : {v.vin}</div>}
                {v.mileage != null && <div className="text-xs">Kilométrage : {Number(v.mileage).toLocaleString("fr-FR")} km</div>}
                {v.firstRegistrationDate && <div className="text-xs">1ère mise en circulation : {fmtDate(v.firstRegistrationDate)}</div>}
                {v.fuelType && <div className="text-xs">Carburant : {v.fuelType}</div>}
                {v.transmission && <div className="text-xs">Boîte : {v.transmission}</div>}
                {v.color && <div className="text-xs">Couleur : {v.color}</div>}
                {v.year && <div className="text-xs">Année : {v.year}</div>}
              </>
            ) : (
              <>
                <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">Chantier</div>
                <div className="mt-1 text-sm font-semibold">{chantier.name}</div>
                {chantier.reference && <div className="text-xs">Réf : {chantier.reference}</div>}
                {chantier.address && <div className="text-xs">{chantier.address}</div>}
                <div className="text-xs">{[chantier.postalCode, chantier.city].filter(Boolean).join(" ")}</div>
                {chantier.contact && <div className="text-xs mt-1">Contact : {chantier.contact}</div>}
                {chantier.startDate && <div className="text-xs">Début : {fmtDate(chantier.startDate)}</div>}
              </>
            )}
          </div>
        )}
      </div>

      {/* Line items */}
      {(inv.lineItems || []).length > 0 && (
        <table className="w-full mt-6 text-sm">
          <thead>
            <tr className="text-left border-b-2" style={{ borderColor: accent }}>
              <th className="py-2 pr-2">Désignation</th>
              <th className="py-2 px-2 text-right w-16">Qté</th>
              <th className="py-2 px-2 text-right w-24">Prix HT</th>
              <th className="py-2 px-2 text-right w-16">TVA</th>
              <th className="py-2 pl-2 text-right w-28">Total HT</th>
            </tr>
          </thead>
          <tbody>
            {isBuilding && groups ? (
              groups.map(([sec, list]) => (
                <React.Fragment key={sec || "__d"}>
                  {sec && (
                    <tr><td colSpan={5} className="pt-3 pb-1 font-semibold" style={{ color: accent }}>{sec}</td></tr>
                  )}
                  {list.map((it, i) => (
                    <tr key={i} className="border-b border-neutral-100 align-top">
                      <td className="py-2 pr-2"><div>{it.description}</div>{it.category && <div className="text-[11px] text-neutral-500 mt-0.5">{it.category}{it.unit ? ` · ${it.unit}` : ""}</div>}</td>
                      <td className="py-2 px-2 text-right">{it.pricingMethod === "hourly" ? `${Number(it.hours || 0)} h` : `${Number(it.qty || 0)} ${it.unit || ""}`}</td>
                      <td className="py-2 px-2 text-right">{fmt(it.unitPrice)}</td>
                      <td className="py-2 px-2 text-right">{Number(it.vat || 0)}%</td>
                      <td className="py-2 pl-2 text-right font-medium">{fmt(it.lineHT)}</td>
                    </tr>
                  ))}
                  {sec && (
                    <tr><td colSpan={4} className="py-1 pr-2 text-right text-xs text-neutral-500">Sous-total {sec}</td><td className="py-1 pl-2 text-right text-xs font-semibold">{fmt(list.reduce((s, it) => s + (it.lineHT || 0), 0))}</td></tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              inv.lineItems.map((it, i) => (
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
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Totals + notes */}
      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="text-xs text-neutral-700 space-y-2">
          {inv.worksPerformed && (<div><span className="font-semibold">Travaux effectués :</span><div className="whitespace-pre-line">{inv.worksPerformed}</div></div>)}
          {inv.observations && (<div><span className="font-semibold">Observations / Recommandations :</span><div className="whitespace-pre-line">{inv.observations}</div></div>)}
          {(inv.nextServiceDate || inv.nextServiceMileage) && (
            <div><span className="font-semibold">Prochaine révision :</span> {[inv.nextServiceDate && fmtDate(inv.nextServiceDate), inv.nextServiceMileage && `${Number(inv.nextServiceMileage).toLocaleString("fr-FR")} km`].filter(Boolean).join(" ou ")}</div>
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
          <Row label="Total TTC" value={inv.totalTTC} bold primary color={accent} />
          {inv.depositPaid ? <Row label="Acompte versé" value={-Math.abs(inv.depositPaid)} /> : null}
          {inv.alreadyPaid ? <Row label="Déjà payé" value={-Math.abs(inv.alreadyPaid)} /> : null}
          {inv.tradeIn?.enabled ? <Row label="Reprise véhicule" value={-Math.abs(inv.tradeIn.value || 0)} /> : null}
          {(inv.depositPaid || inv.alreadyPaid || inv.tradeIn?.enabled) ? (<><div className="border-t border-neutral-300 my-1" /><Row label="Reste à payer" value={inv.balanceDue} bold /></>) : null}
        </div>
      </div>

      {/* Signature / stamp area */}
      {(inv.showSignatureArea || showStamp || co?.signatureBase64) && (
        <div className="mt-6 grid grid-cols-2 gap-6">
          {inv.showSignatureArea && (
            <div className="border border-dashed border-neutral-300 rounded-lg p-3 min-h-[110px]">
              <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">Pour le client</div>
              <div className="text-[11px] text-neutral-500 mt-1">Signature précédée de la mention « Bon pour accord »</div>
            </div>
          )}
          <div className={`border border-dashed border-neutral-300 rounded-lg p-3 min-h-[110px] ${!inv.showSignatureArea ? "col-span-2" : ""} relative`}>
            <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">Pour la société</div>
            <div className="flex items-end justify-end gap-3 mt-2">
              {co?.signatureBase64 && <img src={co.signatureBase64} alt="signature" style={{ height: 60, maxWidth: 200, objectFit: "contain" }} />}
              {showStamp && <img src={co.stampBase64} alt="cachet" style={{ height: 90, maxWidth: 130, objectFit: "contain", opacity: 0.9 }} />}
            </div>
          </div>
        </div>
      )}

      {/* Bank info */}
      {(co?.iban || co?.bic) && !isPurchase && (inv.docType !== "quote") && (
        <div className="mt-4 text-xs text-neutral-600">
          <div className="font-semibold text-neutral-700">Coordonnées bancaires</div>
          {co.bankName && <div>Banque : {co.bankName}</div>}
          {co.iban && <div>IBAN : {co.iban}</div>}
          {co.bic && <div>BIC : {co.bic}</div>}
        </div>
      )}

      {(inv.terms || co?.defaultTerms || s.defaultTerms) && (
        <div className="mt-4 text-xs text-neutral-600">
          <div className="font-semibold text-neutral-700">{inv.docType === "quote" ? "Conditions du devis" : "Conditions de paiement"}</div>
          <div className="whitespace-pre-line">{inv.terms || co?.defaultTerms || s.defaultTerms}</div>
        </div>
      )}

      {(co?.footer || s.legalFooter) && (
        <div className="mt-6 pt-3 border-t border-neutral-200 text-[10px] text-neutral-500 text-center whitespace-pre-line">{co?.footer || s.legalFooter}</div>
      )}
    </div>
  );
}
