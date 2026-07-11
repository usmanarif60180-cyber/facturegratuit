"use client";

import * as React from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { uploadOrganizationFile } from "@/lib/firebase/storage";
import { INDUSTRY_PRESETS } from "@/lib/design/industries";
import { getTemplate } from "@/lib/design/templates";
import type { BrandKit, DesignConfig } from "@/types/design";
import type { Organization } from "@/types";

interface BrandKitPanelProps {
  brandKit: BrandKit;
  onChange: (brandKit: BrandKit) => void;
  organization: Organization | null;
  onLogoUploaded: (url: string) => void;
  onApplyIndustry: (design: DesignConfig, brandKit: BrandKit) => void;
  design: DesignConfig;
}

export function BrandKitPanel({ brandKit, onChange, organization, onLogoUploaded, onApplyIndustry, design }: BrandKitPanelProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = React.useState<"logo" | "signature" | null>(null);
  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const signatureInputRef = React.useRef<HTMLInputElement>(null);

  function setBank(patch: Partial<NonNullable<BrandKit["bank"]>>) {
    onChange({ ...brandKit, bank: { ...brandKit.bank, ...patch } });
  }

  async function handleUpload(kind: "logo" | "signature", file: File) {
    if (!organization) return;
    setUploading(kind);
    try {
      const url = await uploadOrganizationFile(organization.id, kind === "logo" ? "logos" : "signatures", file);
      if (kind === "logo") onLogoUploaded(url);
      else onChange({ ...brandKit, signatureUrl: url });
      toast({ variant: "success", title: `${kind === "logo" ? "Logo" : "Signature"} uploaded` });
    } catch {
      toast({ variant: "error", title: "Upload failed" });
    } finally {
      setUploading(null);
    }
  }

  function applyIndustry(id: string) {
    const preset = INDUSTRY_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    const template = getTemplate(preset.templateId);
    const sections = design.sections.map((s) =>
      preset.enabledSections.includes(s.id) ? { ...s, visible: true } : s
    );
    onApplyIndustry(template ? { ...template.design, sections } : { ...design, sections }, {
      ...brandKit,
      defaultPaymentTerms: preset.suggestedPaymentTerms,
      defaultNotes: preset.suggestedNotes,
    });
    toast({ variant: "success", title: `Applied the ${preset.name} preset` });
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-1.5 block text-sm font-medium">Industry preset</label>
        <Select defaultValue="" onChange={(e) => e.target.value && applyIndustry(e.target.value)}>
          <option value="" disabled>Choose an industry to pre-fill colors, layout and terms…</option>
          {INDUSTRY_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Logo</Label>
          <div className="mt-1.5 flex items-center gap-3">
            {organization?.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={organization.logoUrl} alt="Logo" className="h-10 w-10 rounded-md border border-border object-contain" />
            )}
            <Button variant="outline" size="sm" loading={uploading === "logo"} onClick={() => logoInputRef.current?.click()} className="gap-2">
              <Upload className="h-3.5 w-3.5" /> Upload logo
            </Button>
            <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload("logo", e.target.files[0])} />
          </div>
        </div>
        <div>
          <Label>Signature</Label>
          <div className="mt-1.5 flex items-center gap-3">
            {brandKit.signatureUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brandKit.signatureUrl} alt="Signature" className="h-10 rounded-md border border-border bg-white object-contain px-2" />
            )}
            <Button variant="outline" size="sm" loading={uploading === "signature"} onClick={() => signatureInputRef.current?.click()} className="gap-2">
              <Upload className="h-3.5 w-3.5" /> Upload signature
            </Button>
            <input ref={signatureInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload("signature", e.target.files[0])} />
          </div>
        </div>
      </div>

      <div>
        <Label>Stamp text</Label>
        <Input placeholder="e.g. APPROVED, COMPANY NAME" value={brandKit.stampText ?? ""} onChange={(e) => onChange({ ...brandKit, stampText: e.target.value })} />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Bank information</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label>Account name</Label>
            <Input value={brandKit.bank?.accountName ?? ""} onChange={(e) => setBank({ accountName: e.target.value })} />
          </div>
          <div>
            <Label>Account number</Label>
            <Input value={brandKit.bank?.accountNumber ?? ""} onChange={(e) => setBank({ accountNumber: e.target.value })} />
          </div>
          <div>
            <Label>Bank name</Label>
            <Input value={brandKit.bank?.bankName ?? ""} onChange={(e) => setBank({ bankName: e.target.value })} />
          </div>
          <div>
            <Label>IBAN</Label>
            <Input value={brandKit.bank?.iban ?? ""} onChange={(e) => setBank({ iban: e.target.value })} />
          </div>
          <div>
            <Label>SWIFT/BIC</Label>
            <Input value={brandKit.bank?.swift ?? ""} onChange={(e) => setBank({ swift: e.target.value })} />
          </div>
        </div>
      </div>

      <div>
        <Label>Default payment terms</Label>
        <Textarea rows={2} value={brandKit.defaultPaymentTerms ?? ""} onChange={(e) => onChange({ ...brandKit, defaultPaymentTerms: e.target.value })} />
      </div>
      <div>
        <Label>Default notes</Label>
        <Textarea rows={2} value={brandKit.defaultNotes ?? ""} onChange={(e) => onChange({ ...brandKit, defaultNotes: e.target.value })} />
      </div>
      <div>
        <Label>Default terms &amp; conditions</Label>
        <Textarea rows={2} value={brandKit.defaultTerms ?? ""} onChange={(e) => onChange({ ...brandKit, defaultTerms: e.target.value })} />
      </div>
    </div>
  );
}
