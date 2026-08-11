import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { fuelTypes, transmissions } from "../../lib/calc";
import { Car } from "lucide-react";

export default function VehicleForm({ value, onChange, extended = false, title = "Informations du véhicule" }) {
  const v = value || {};
  const upd = (k, val) => onChange({ ...v, [k]: val });
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center"><Car className="h-4 w-4" /></div>
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div><Label className="text-xs">Marque</Label><Input value={v.make || ""} onChange={(e) => upd("make", e.target.value)} placeholder="BMW" /></div>
        <div><Label className="text-xs">Modèle</Label><Input value={v.model || ""} onChange={(e) => upd("model", e.target.value)} placeholder="Série 3" /></div>
        <div><Label className="text-xs">Version</Label><Input value={v.version || ""} onChange={(e) => upd("version", e.target.value)} placeholder="320d" /></div>
        <div><Label className="text-xs">Immatriculation</Label><Input value={v.registration || ""} onChange={(e) => upd("registration", e.target.value.toUpperCase())} placeholder="AB-123-CD" /></div>
        <div><Label className="text-xs">VIN / N° de châssis</Label><Input value={v.vin || ""} onChange={(e) => upd("vin", e.target.value.toUpperCase())} placeholder="WBA..." /></div>
        <div><Label className="text-xs">Kilométrage</Label><Input type="number" value={v.mileage ?? ""} onChange={(e) => upd("mileage", e.target.value === "" ? null : Number(e.target.value))} placeholder="128500" /></div>
        <div><Label className="text-xs">1ère mise en circulation</Label><Input type="date" value={v.firstRegistrationDate || ""} onChange={(e) => upd("firstRegistrationDate", e.target.value)} /></div>
        <div>
          <Label className="text-xs">Carburant</Label>
          <Select value={v.fuelType || ""} onValueChange={(val) => upd("fuelType", val)}>
            <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
            <SelectContent>{fuelTypes.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label className="text-xs">Couleur</Label><Input value={v.color || ""} onChange={(e) => upd("color", e.target.value)} placeholder="Noir" /></div>
        <div><Label className="text-xs">Puissance fiscale</Label><Input value={v.fiscalPower || ""} onChange={(e) => upd("fiscalPower", e.target.value)} placeholder="7 CV" /></div>
        <div><Label className="text-xs">Année</Label><Input type="number" value={v.year ?? ""} onChange={(e) => upd("year", e.target.value === "" ? null : Number(e.target.value))} placeholder="2018" /></div>
        {extended && (
          <>
            <div>
              <Label className="text-xs">Boîte de vitesses</Label>
              <Select value={v.transmission || ""} onValueChange={(val) => upd("transmission", val)}>
                <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>{transmissions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Nombre de portes</Label><Input type="number" value={v.doors ?? ""} onChange={(e) => upd("doors", e.target.value === "" ? null : Number(e.target.value))} /></div>
            <div><Label className="text-xs">Nombre de places</Label><Input type="number" value={v.seats ?? ""} onChange={(e) => upd("seats", e.target.value === "" ? null : Number(e.target.value))} /></div>
          </>
        )}
      </div>
    </div>
  );
}
