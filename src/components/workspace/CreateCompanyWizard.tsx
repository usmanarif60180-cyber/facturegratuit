"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Building2, Check, Loader2, Sparkles, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/context/AuthContext";
import { useOrganization } from "@/hooks/useOrganization";
import { useToast } from "@/components/ui/Toast";
import { createCompany } from "@/lib/services/organizationService";
import { uploadOrganizationFile } from "@/lib/firebase/storage";
import { COUNTRIES } from "@/lib/constants/countries";
import { CURRENCIES } from "@/lib/constants/currencies";
import { LANGUAGES } from "@/lib/constants/languages";
import { INDUSTRY_PRESETS } from "@/lib/design/industries";
import { BUILTIN_PALETTES } from "@/lib/design/palettes";
import { getTemplate, BUILTIN_TEMPLATES } from "@/lib/design/templates";
import { buildDesignConfig } from "@/lib/design/defaults";
import { DEFAULT_ORGANIZATION_SETTINGS } from "@/types/organization";
import { cn } from "@/lib/utils/cn";

interface CreateCompanyWizardProps {
  open: boolean;
  onClose: () => void;
}

const STEPS = ["basics", "branding", "business", "review"] as const;
type Step = (typeof STEPS)[number];

export function CreateCompanyWizard({ open, onClose }: CreateCompanyWizardProps) {
  const { firebaseUser, switchOrganization } = useAuth();
  const { organization: activeOrg } = useOrganization();
  const { toast } = useToast();
  const [mounted, setMounted] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [creating, setCreating] = React.useState(false);
  const [uploading, setUploading] = React.useState<"logo" | "signature" | null>(null);
  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const signatureInputRef = React.useRef<HTMLInputElement>(null);

  const [name, setName] = React.useState("");
  const [industry, setIndustry] = React.useState("");
  const [country, setCountry] = React.useState("US");
  const [currency, setCurrency] = React.useState("USD");
  const [language, setLanguage] = React.useState("en");
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const [stampText, setStampText] = React.useState("");
  const [signatureUrl, setSignatureUrl] = React.useState<string | null>(null);
  const [paletteId, setPaletteId] = React.useState("royal-blue");
  const [templateId, setTemplateId] = React.useState<string | null>(null);
  const [vatNumber, setVatNumber] = React.useState("");
  const [bankName, setBankName] = React.useState("");
  const [accountName, setAccountName] = React.useState("");
  const [accountNumber, setAccountNumber] = React.useState("");
  const [iban, setIban] = React.useState("");
  const [swift, setSwift] = React.useState("");

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function reset() {
    setStep(0);
    setName("");
    setIndustry("");
    setCountry("US");
    setCurrency("USD");
    setLanguage("en");
    setLogoUrl(null);
    setStampText("");
    setSignatureUrl(null);
    setPaletteId("royal-blue");
    setTemplateId(null);
    setVatNumber("");
    setBankName("");
    setAccountName("");
    setAccountNumber("");
    setIban("");
    setSwift("");
  }

  function handleClose() {
    if (creating) return;
    reset();
    onClose();
  }

  const suggestedTemplates = industry
    ? BUILTIN_TEMPLATES.filter((t) => t.id === INDUSTRY_PRESETS.find((p) => p.id === industry)?.templateId)
    : [];
  const templateChoices = [...suggestedTemplates, ...BUILTIN_TEMPLATES.filter((t) => !suggestedTemplates.includes(t))].slice(0, 8);

  async function handleUpload(kind: "logo" | "signature", file: File) {
    if (!firebaseUser) return;
    setUploading(kind);
    if (!activeOrg) return;
    try {
      // The new company doesn't exist as a Firestore doc yet mid-wizard, so
      // storage.rules (which gates writes by the caller's *active* org) has
      // nothing to check against for it. Uploading under the currently
      // active org's path is allowed and still yields a fully working
      // download URL — the returned URL carries its own access token and
      // works regardless of which org "owns" the storage folder.
      const url = await uploadOrganizationFile(activeOrg.id, kind === "logo" ? "logos" : "signatures", file);
      if (kind === "logo") setLogoUrl(url);
      else setSignatureUrl(url);
    } catch {
      toast({ variant: "error", title: "Upload failed" });
    } finally {
      setUploading(null);
    }
  }

  async function handleCreate() {
    if (!firebaseUser || !name.trim()) return;
    setCreating(true);
    try {
      const preset = INDUSTRY_PRESETS.find((p) => p.id === industry);
      const template = templateId ? getTemplate(templateId) : preset ? getTemplate(preset.templateId) : undefined;
      const design = template
        ? { ...template.design, palette: BUILTIN_PALETTES.find((p) => p.id === paletteId) ?? template.design.palette }
        : buildDesignConfig({ id: `company-${Date.now()}`, name: "Default", documentStyle: "professional", paletteId });

      const orgId = await createCompany(firebaseUser.uid, {
        name: name.trim(),
        businessType: industry || undefined,
        logoUrl,
        vatNumber: vatNumber || undefined,
        address: { countryCode: country },
        settings: { ...DEFAULT_ORGANIZATION_SETTINGS, defaultCurrency: currency, defaultLanguage: language },
        designConfig: design,
        brandKit: {
          signatureUrl,
          stampText: stampText || undefined,
          defaultPaymentTerms: preset?.suggestedPaymentTerms,
          defaultNotes: preset?.suggestedNotes,
          bank: (bankName || accountName || accountNumber || iban || swift)
            ? { bankName, accountName, accountNumber, iban, swift }
            : undefined,
        },
      });

      await switchOrganization(orgId);
      toast({ variant: "success", title: `${name.trim()} is ready`, description: "Switched to your new workspace." });
      handleClose();
    } catch {
      toast({ variant: "error", title: "Couldn't create the company", description: "Please try again." });
    } finally {
      setCreating(false);
    }
  }

  if (!mounted || !open) return null;

  const current: Step = STEPS[step]!;
  const isLast = step === STEPS.length - 1;

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Create a new company">
      <div className="absolute inset-0 animate-fade-in bg-black/50 backdrop-blur-sm" onClick={handleClose} aria-hidden="true" />
      <div className="glass relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold">Create a new company</p>
          </div>
          <button onClick={handleClose} aria-label="Close" className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 px-6 pt-4">
          {STEPS.map((s, i) => (
            <span key={s} className={cn("h-1.5 flex-1 rounded-full transition-colors", i <= step ? "bg-primary" : "bg-muted")} />
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {current === "basics" && (
            <div className="space-y-4">
              <div>
                <Label>Company name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="ABC Construction" autoFocus />
              </div>
              <div>
                <Label>Industry</Label>
                <Select value={industry} onChange={(e) => setIndustry(e.target.value)}>
                  <option value="">Select an industry…</option>
                  {INDUSTRY_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Country</Label>
                  <Select value={country} onChange={(e) => setCountry(e.target.value)}>
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>Currency</Label>
                  <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.code}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>Language</Label>
                  <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    {LANGUAGES.map((l) => (
                      <option key={l.tag} value={l.tag}>{l.label}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          )}

          {current === "branding" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Logo</Label>
                  <div className="mt-1.5 flex items-center gap-2.5">
                    {logoUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logoUrl} alt="Logo" className="h-9 w-9 rounded-md border border-border object-contain" />
                    )}
                    <Button type="button" variant="outline" size="sm" loading={uploading === "logo"} onClick={() => logoInputRef.current?.click()} className="gap-1.5">
                      <Upload className="h-3.5 w-3.5" /> Upload
                    </Button>
                    <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload("logo", e.target.files[0])} />
                  </div>
                </div>
                <div>
                  <Label>Signature</Label>
                  <div className="mt-1.5 flex items-center gap-2.5">
                    {signatureUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={signatureUrl} alt="Signature" className="h-9 rounded-md border border-border bg-white object-contain px-1.5" />
                    )}
                    <Button type="button" variant="outline" size="sm" loading={uploading === "signature"} onClick={() => signatureInputRef.current?.click()} className="gap-1.5">
                      <Upload className="h-3.5 w-3.5" /> Upload
                    </Button>
                    <input ref={signatureInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload("signature", e.target.files[0])} />
                  </div>
                </div>
              </div>
              <div>
                <Label>Stamp text</Label>
                <Input value={stampText} onChange={(e) => setStampText(e.target.value)} placeholder="e.g. COMPANY NAME" />
              </div>
              <div>
                <p className="mb-1.5 text-sm font-medium">Brand colors</p>
                <div className="grid grid-cols-6 gap-2">
                  {BUILTIN_PALETTES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaletteId(p.id)}
                      aria-label={p.name}
                      className={cn("h-8 rounded-md border-2 transition-transform hover:scale-105", paletteId === p.id ? "border-primary" : "border-transparent")}
                      style={{ background: `linear-gradient(135deg, ${p.primary}, ${p.secondary})` }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-sm font-medium">Preferred template</p>
                <div className="grid grid-cols-4 gap-2">
                  {templateChoices.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTemplateId(t.id)}
                      className={cn(
                        "rounded-md border p-1.5 text-left transition-colors",
                        (templateId ?? suggestedTemplates[0]?.id) === t.id ? "border-primary bg-primary/5" : "border-border"
                      )}
                    >
                      <span className="mb-1 block h-6 rounded-sm" style={{ background: t.design.palette.tableHeaderBg }} />
                      <span className="block truncate text-[11px] font-medium">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {current === "business" && (
            <div className="space-y-4">
              <div>
                <Label>VAT number</Label>
                <Input value={vatNumber} onChange={(e) => setVatNumber(e.target.value)} />
              </div>
              <p className="text-sm font-medium">Bank details (optional)</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Account name</Label>
                  <Input value={accountName} onChange={(e) => setAccountName(e.target.value)} />
                </div>
                <div>
                  <Label>Account number</Label>
                  <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                </div>
                <div>
                  <Label>Bank name</Label>
                  <Input value={bankName} onChange={(e) => setBankName(e.target.value)} />
                </div>
                <div>
                  <Label>IBAN</Label>
                  <Input value={iban} onChange={(e) => setIban(e.target.value)} />
                </div>
                <div>
                  <Label>SWIFT/BIC</Label>
                  <Input value={swift} onChange={(e) => setSwift(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {current === "review" && (
            <div className="flex flex-col items-center py-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{name || "Your new company"}</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {INDUSTRY_PRESETS.find((p) => p.id === industry)?.name ?? "General business"} · {currency} · {COUNTRIES.find((c) => c.code === country)?.name}
              </p>
              <div className="mt-4 grid w-full max-w-xs grid-cols-2 gap-2 text-left text-xs">
                <div className="rounded-md border border-border p-2">
                  <p className="text-muted-foreground">Logo</p>
                  <p className="font-medium">{logoUrl ? "Uploaded" : "Not set"}</p>
                </div>
                <div className="rounded-md border border-border p-2">
                  <p className="text-muted-foreground">Template</p>
                  <p className="font-medium">{(templateId && getTemplate(templateId)?.name) || suggestedTemplates[0]?.name || "Default"}</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                This company gets its own clients, products, invoices, quotes, expenses and branding — completely
                independent from your other workspaces.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border/60 px-6 py-4">
          <Button variant="ghost" size="sm" onClick={() => setStep((s) => Math.max(0, s - 1))} className={cn(step === 0 && "invisible")}>
            Back
          </Button>
          {isLast ? (
            <Button size="sm" loading={creating} disabled={!name.trim()} onClick={handleCreate} className="gap-2">
              <Check className="h-4 w-4" /> Create company
            </Button>
          ) : (
            <Button size="sm" disabled={current === "basics" && !name.trim()} onClick={() => setStep((s) => s + 1)}>
              Continue
            </Button>
          )}
        </div>
        {creating && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/70 backdrop-blur-sm">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
