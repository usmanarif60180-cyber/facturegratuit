import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Plus, Trash2, Search, Car } from "lucide-react";
import { api } from "../lib/api";
import { toast } from "../hooks/use-toast";
import { fuelTypes } from "../lib/calc";

const emptyClient = { name: "", company: "", email: "", phone: "", address: "", city: "", postalCode: "", country: "France", siret: "", vatNumber: "", clientType: "Particulier", notes: "" };
const emptyVehicle = { make: "", model: "", version: "", registration: "", vin: "", mileage: null, firstRegistrationDate: "", fuelType: "", color: "", year: null };

export default function Clients() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(emptyClient);
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [vehicleData, setVehicleData] = useState(emptyVehicle);
  const [activeClient, setActiveClient] = useState(null);
  const [vehicles, setVehicles] = useState([]);

  const load = async () => setItems(await api.listClients());
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing.name.trim()) { toast({ title: "Le nom est requis" }); return; }
    if (editing.id) await api.updateClient(editing.id, editing);
    else await api.createClient(editing);
    toast({ title: "Client enregistré" });
    setOpen(false); setEditing(emptyClient); load();
  };
  const remove = async (id) => {
    if (!window.confirm("Supprimer ce client ?")) return;
    await api.deleteClient(id);
    load();
  };

  const openVehicles = async (c) => {
    setActiveClient(c);
    setVehicles(await api.listVehicles(c.id));
  };

  const saveVehicle = async () => {
    if (!vehicleData.make && !vehicleData.model && !vehicleData.registration) { toast({ title: "Renseignez au moins marque, modèle ou immatriculation" }); return; }
    await api.createVehicle({ ...vehicleData, clientId: activeClient.id });
    toast({ title: "Véhicule ajouté" });
    setVehicleOpen(false); setVehicleData(emptyVehicle);
    setVehicles(await api.listVehicles(activeClient.id));
  };

  const filtered = items.filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || (c.company || "").toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div>
          <h1 className="text-3xl font-semibold">Clients</h1>
          <p className="text-sm text-neutral-500 mt-1">Gérez vos clients et leurs véhicules.</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(emptyClient); }}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white"><Plus className="h-4 w-4 mr-1" /> Nouveau client</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{editing.id ? "Modifier le client" : "Nouveau client"}</DialogTitle></DialogHeader>
            <div className="grid md:grid-cols-2 gap-3">
              <div><Label className="text-xs">Nom *</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label className="text-xs">Société</Label><Input value={editing.company} onChange={(e) => setEditing({ ...editing, company: e.target.value })} /></div>
              <div>
                <Label className="text-xs">Type</Label>
                <Select value={editing.clientType} onValueChange={(v) => setEditing({ ...editing, clientType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Particulier">Particulier</SelectItem><SelectItem value="Professionnel">Professionnel</SelectItem><SelectItem value="Société">Société</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Email</Label><Input type="email" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></div>
              <div><Label className="text-xs">Téléphone</Label><Input value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></div>
              <div><Label className="text-xs">SIRET</Label><Input value={editing.siret} onChange={(e) => setEditing({ ...editing, siret: e.target.value })} /></div>
              <div className="md:col-span-2"><Label className="text-xs">Adresse</Label><Input value={editing.address} onChange={(e) => setEditing({ ...editing, address: e.target.value })} /></div>
              <div><Label className="text-xs">Code postal</Label><Input value={editing.postalCode} onChange={(e) => setEditing({ ...editing, postalCode: e.target.value })} /></div>
              <div><Label className="text-xs">Ville</Label><Input value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })} /></div>
              <div><Label className="text-xs">Pays</Label><Input value={editing.country} onChange={(e) => setEditing({ ...editing, country: e.target.value })} /></div>
            </div>
            <DialogFooter><Button onClick={save} className="bg-indigo-600 hover:bg-indigo-700 text-white">Enregistrer</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-4">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un client..." className="pl-9 max-w-md" />
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium">Nom</th>
              <th className="text-left px-3 py-2.5 font-medium">Société</th>
              <th className="text-left px-3 py-2.5 font-medium">Type</th>
              <th className="text-left px-3 py-2.5 font-medium">Email</th>
              <th className="text-left px-3 py-2.5 font-medium">Téléphone</th>
              <th className="px-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-neutral-500">Aucun client. Créez votre premier client.</td></tr>}
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-3 py-3 text-neutral-600 dark:text-neutral-400">{c.company}</td>
                <td className="px-3 py-3"><span className="inline-block px-2 py-0.5 rounded-full text-[11px] bg-neutral-100 dark:bg-neutral-800">{c.clientType}</span></td>
                <td className="px-3 py-3 text-neutral-600 dark:text-neutral-400">{c.email}</td>
                <td className="px-3 py-3 text-neutral-600 dark:text-neutral-400">{c.phone}</td>
                <td className="px-3 py-3 text-right whitespace-nowrap">
                  <button onClick={() => openVehicles(c)} className="h-8 px-2 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-950 inline-flex items-center gap-1 text-xs text-indigo-600"><Car className="h-3.5 w-3.5" /> Véhicules</button>
                  <button onClick={() => { setEditing(c); setOpen(true); }} className="h-8 px-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 inline-flex items-center gap-1 text-xs">Modifier</button>
                  <button onClick={() => remove(c.id)} className="h-8 w-8 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950 inline-flex items-center justify-center text-rose-500"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vehicles dialog */}
      <Dialog open={!!activeClient} onOpenChange={(o) => !o && setActiveClient(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Véhicules de {activeClient?.name}</DialogTitle></DialogHeader>
          <div className="flex justify-end mb-2">
            <Button size="sm" onClick={() => setVehicleOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Plus className="h-3.5 w-3.5 mr-1" /> Ajouter</Button>
          </div>
          <div className="space-y-2">
            {vehicles.length === 0 && <div className="text-sm text-neutral-500 py-6 text-center">Aucun véhicule enregistré.</div>}
            {vehicles.map((v) => (
              <div key={v.id} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <div className="font-medium">{[v.make, v.model, v.version].filter(Boolean).join(" ")}</div>
                  <div className="text-xs text-neutral-500">{v.registration} • {v.vin || "VIN inconnu"} • {v.mileage ? `${v.mileage.toLocaleString("fr-FR")} km` : "km ?"}</div>
                </div>
                <button onClick={async () => { await api.deleteVehicle(v.id); setVehicles(await api.listVehicles(activeClient.id)); }} className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 h-8 w-8 rounded-md inline-flex items-center justify-center"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={vehicleOpen} onOpenChange={setVehicleOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Nouveau véhicule</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Marque</Label><Input value={vehicleData.make} onChange={(e) => setVehicleData({ ...vehicleData, make: e.target.value })} /></div>
            <div><Label className="text-xs">Modèle</Label><Input value={vehicleData.model} onChange={(e) => setVehicleData({ ...vehicleData, model: e.target.value })} /></div>
            <div><Label className="text-xs">Version</Label><Input value={vehicleData.version} onChange={(e) => setVehicleData({ ...vehicleData, version: e.target.value })} /></div>
            <div><Label className="text-xs">Immatriculation</Label><Input value={vehicleData.registration} onChange={(e) => setVehicleData({ ...vehicleData, registration: e.target.value.toUpperCase() })} /></div>
            <div><Label className="text-xs">VIN</Label><Input value={vehicleData.vin} onChange={(e) => setVehicleData({ ...vehicleData, vin: e.target.value.toUpperCase() })} /></div>
            <div><Label className="text-xs">Kilométrage</Label><Input type="number" value={vehicleData.mileage ?? ""} onChange={(e) => setVehicleData({ ...vehicleData, mileage: e.target.value === "" ? null : Number(e.target.value) })} /></div>
            <div><Label className="text-xs">1ère mise en circulation</Label><Input type="date" value={vehicleData.firstRegistrationDate} onChange={(e) => setVehicleData({ ...vehicleData, firstRegistrationDate: e.target.value })} /></div>
            <div>
              <Label className="text-xs">Carburant</Label>
              <Select value={vehicleData.fuelType} onValueChange={(v) => setVehicleData({ ...vehicleData, fuelType: v })}>
                <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                <SelectContent>{fuelTypes.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Couleur</Label><Input value={vehicleData.color} onChange={(e) => setVehicleData({ ...vehicleData, color: e.target.value })} /></div>
            <div><Label className="text-xs">Année</Label><Input type="number" value={vehicleData.year ?? ""} onChange={(e) => setVehicleData({ ...vehicleData, year: e.target.value === "" ? null : Number(e.target.value) })} /></div>
          </div>
          <DialogFooter><Button onClick={saveVehicle} className="bg-indigo-600 hover:bg-indigo-700 text-white">Ajouter</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
