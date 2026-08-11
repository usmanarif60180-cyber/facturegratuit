import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { PenTool, Eraser } from "lucide-react";

function Pad({ value, onChange }) {
  const ref = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const lastPt = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2;
    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
      img.src = value;
    }
  }, []); // eslint-disable-line

  const pt = (e) => {
    const c = ref.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - c.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - c.top;
    return { x, y };
  };
  const start = (e) => { setDrawing(true); lastPt.current = pt(e); e.preventDefault(); };
  const move = (e) => {
    if (!drawing) return;
    const p = pt(e);
    const ctx = ref.current.getContext("2d");
    ctx.beginPath(); ctx.moveTo(lastPt.current.x, lastPt.current.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    lastPt.current = p; e.preventDefault();
  };
  const end = () => {
    if (!drawing) return;
    setDrawing(false);
    onChange(ref.current.toDataURL("image/png"));
  };
  const clear = () => {
    const c = ref.current; const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    onChange("");
  };
  return (
    <div>
      <canvas ref={ref} className="w-full h-40 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white touch-none cursor-crosshair"
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={move} onTouchEnd={end} />
      <div className="flex justify-end mt-2">
        <Button type="button" variant="outline" size="sm" onClick={clear}><Eraser className="h-3.5 w-3.5 mr-1" /> Effacer</Button>
      </div>
    </div>
  );
}

export default function AcceptQuoteDialog({ open, onClose, invoice, onAccepted }) {
  const [name, setName] = useState("");
  const [signature, setSignature] = useState("");
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) { setName(invoice?.clientSnapshot?.name || ""); setSignature(""); setComment(""); }
  }, [open, invoice]);

  const submit = async () => {
    if (!name.trim()) { alert("Nom du signataire requis"); return; }
    setSaving(true);
    try {
      await onAccepted({ signerName: name, signatureBase64: signature, comment });
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><PenTool className="h-4 w-4 text-indigo-500" /> Accepter le devis — Bon pour accord</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="text-sm text-neutral-600 dark:text-neutral-400">En signant ci-dessous, le client accepte le devis <span className="font-mono font-semibold">{invoice?.number}</span> pour un total de <span className="font-semibold">{invoice?.totalTTC?.toFixed(2)} €</span> TTC.</div>
          <div><Label className="text-xs">Nom du signataire *</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du client" /></div>
          <div><Label className="text-xs">Signature</Label><Pad value={signature} onChange={setSignature} /><div className="text-[10px] text-neutral-500 mt-1">Signature précédée de la mention « Bon pour accord »</div></div>
          <div><Label className="text-xs">Commentaire (facultatif)</Label><Textarea value={comment} onChange={(e) => setComment(e.target.value)} className="min-h-[60px]" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={submit} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">Bon pour accord</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
