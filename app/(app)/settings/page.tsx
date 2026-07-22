"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import { useToast } from "@/components/ui/Toast";
import { useSound } from "@/context/SoundContext";
import { useOrganization } from "@/hooks/useOrganization";
import { updateOrganization } from "@/lib/services/organizationService";
import { COUNTRIES } from "@/lib/constants/countries";
import { CURRENCIES } from "@/lib/constants/currencies";
import { LANGUAGES } from "@/lib/constants/languages";
import { INDUSTRY_PRESETS } from "@/lib/design/industries";
import { BUILTIN_TEMPLATES } from "@/lib/design/templates";
import { PLANS } from "@/config/plans";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import type { SocialLinks } from "@/types";

export default function SettingsPage() {
  const { organization, loading } = useOrganization();
  const { toast } = useToast();
  const { enabled: soundEnabled, setEnabled: setSoundEnabled, play } = useSound();
  const [saving, setSaving] = React.useState(false);

  const [name, setName] = React.useState("");
  const [legalName, setLegalName] = React.useState("");
  const [businessType, setBusinessType] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [countryCode, setCountryCode] = React.useState("");
  const [city, setCity] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [vatNumber, setVatNumber] = React.useState("");
  const [registrationNumber, setRegistrationNumber] = React.useState("");
  const [businessLicenseNumber, setBusinessLicenseNumber] = React.useState("");
  const [socialLinks, setSocialLinks] = React.useState<SocialLinks>({});
  const [defaultInvoiceTemplateId, setDefaultInvoiceTemplateId] = React.useState("");
  const [defaultQuoteTemplateId, setDefaultQuoteTemplateId] = React.useState("");
  const [currency, setCurrency] = React.useState("USD");
  const [language, setLanguage] = React.useState("en");
  const [invoicePrefix, setInvoicePrefix] = React.useState("INV-");
  const [quotePrefix, setQuotePrefix] = React.useState("QUO-");

  React.useEffect(() => {
    if (!organization) return;
    setName(organization.name ?? "");
    setLegalName(organization.legalName ?? "");
    setBusinessType(organization.businessType ?? "");
    setEmail(organization.email ?? "");
    setPhone(organization.phone ?? "");
    setCountryCode(organization.address?.countryCode ?? "");
    setCity(organization.address?.city ?? "");
    setPostalCode(organization.address?.postalCode ?? "");
    setVatNumber(organization.vatNumber ?? "");
    setRegistrationNumber(organization.registrationNumber ?? "");
    setBusinessLicenseNumber(organization.businessLicenseNumber ?? "");
    setSocialLinks(organization.socialLinks ?? {});
    setDefaultInvoiceTemplateId(organization.defaultInvoiceTemplateId ?? "");
    setDefaultQuoteTemplateId(organization.defaultQuoteTemplateId ?? "");
    setCurrency(organization.settings.defaultCurrency);
    setLanguage(organization.settings.defaultLanguage);
    setInvoicePrefix(organization.settings.invoicePrefix);
    setQuotePrefix(organization.settings.quotePrefix);
  }, [organization]);

  async function handleSaveGeneral() {
    if (!organization) return;
    setSaving(true);
    try {
      await updateOrganization(organization.id, {
        name,
        legalName: legalName || undefined,
        businessType: businessType || undefined,
        email: email || undefined,
        phone: phone || undefined,
        address: { ...organization.address, countryCode: countryCode || undefined, city: city || undefined, postalCode: postalCode || undefined },
        vatNumber: vatNumber || undefined,
        registrationNumber: registrationNumber || undefined,
        businessLicenseNumber: businessLicenseNumber || undefined,
        socialLinks: Object.values(socialLinks).some(Boolean) ? socialLinks : undefined,
        defaultInvoiceTemplateId: defaultInvoiceTemplateId || undefined,
        defaultQuoteTemplateId: defaultQuoteTemplateId || undefined,
      });
      toast({ variant: "success", title: "Company profile updated" });
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveLocalization() {
    if (!organization) return;
    setSaving(true);
    try {
      await updateOrganization(organization.id, {
        settings: {
          ...organization.settings,
          defaultCurrency: currency,
          defaultLanguage: language,
          invoicePrefix,
          quotePrefix,
        },
      });
      toast({ variant: "success", title: "Preferences updated" });
    } finally {
      setSaving(false);
    }
  }

  if (loading || !organization) {
    return <p className="text-muted-foreground">Loading settings…</p>;
  }

  return (
    <div>
      <PageHeader title="Settings" description="This company's profile, preferences and billing — every company you own has its own." />

      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="localization">Localization</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Company profile</CardTitle>
              <CardDescription>Shown on your invoices and quotes. Logo, signature, bank details and design live in the Design Studio&rsquo;s Brand Kit.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="orgName">Business name</Label>
                <Input id="orgName" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="legalName">Legal name</Label>
                <Input id="legalName" value={legalName} onChange={(e) => setLegalName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="businessType">Business type</Label>
                <Select id="businessType" value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
                  <option value="">Select an industry</option>
                  {INDUSTRY_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="orgEmail">Email</Label>
                <Input id="orgEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="orgPhone">Phone</Label>
                <Input id="orgPhone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="orgCountry">Country</Label>
                <Select
                  id="orgCountry"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="orgCity">City</Label>
                <Input id="orgCity" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="orgPostal">Postal code</Label>
                <Input id="orgPostal" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="vatNumber">VAT number</Label>
                <Input id="vatNumber" value={vatNumber} onChange={(e) => setVatNumber(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="registrationNumber">Registration number</Label>
                <Input id="registrationNumber" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="businessLicenseNumber">Business license number</Label>
                <Input id="businessLicenseNumber" value={businessLicenseNumber} onChange={(e) => setBusinessLicenseNumber(e.target.value)} />
              </div>

              <div className="sm:col-span-2">
                <p className="mb-1.5 text-sm font-medium">Social media links</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    placeholder="Facebook URL"
                    value={socialLinks.facebook ?? ""}
                    onChange={(e) => setSocialLinks((s) => ({ ...s, facebook: e.target.value }))}
                  />
                  <Input
                    placeholder="Instagram URL"
                    value={socialLinks.instagram ?? ""}
                    onChange={(e) => setSocialLinks((s) => ({ ...s, instagram: e.target.value }))}
                  />
                  <Input
                    placeholder="LinkedIn URL"
                    value={socialLinks.linkedin ?? ""}
                    onChange={(e) => setSocialLinks((s) => ({ ...s, linkedin: e.target.value }))}
                  />
                  <Input
                    placeholder="X / Twitter URL"
                    value={socialLinks.twitter ?? ""}
                    onChange={(e) => setSocialLinks((s) => ({ ...s, twitter: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="defaultInvoiceTemplate">Default invoice template</Label>
                <Select id="defaultInvoiceTemplate" value={defaultInvoiceTemplateId} onChange={(e) => setDefaultInvoiceTemplateId(e.target.value)}>
                  <option value="">Use active Design Studio theme</option>
                  {BUILTIN_TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="defaultQuoteTemplate">Default quote template</Label>
                <Select id="defaultQuoteTemplate" value={defaultQuoteTemplateId} onChange={(e) => setDefaultQuoteTemplateId(e.target.value)}>
                  <option value="">Use active Design Studio theme</option>
                  {BUILTIN_TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </Select>
              </div>

              <div className="sm:col-span-2 flex justify-end">
                <Button loading={saving} onClick={handleSaveGeneral}>
                  Save changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization">
          <Card>
            <CardHeader>
              <CardTitle>Currency, language &amp; numbering</CardTitle>
              <CardDescription>Applied as defaults across new documents.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="currency">Default currency</Label>
                <Select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="language">Default language</Label>
                <Select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  {LANGUAGES.map((l) => (
                    <option key={l.tag} value={l.tag}>
                      {l.label} ({l.nativeLabel})
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="invoicePrefix">Invoice number prefix</Label>
                <Input
                  id="invoicePrefix"
                  value={invoicePrefix}
                  onChange={(e) => setInvoicePrefix(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="quotePrefix">Quote number prefix</Label>
                <Input
                  id="quotePrefix"
                  value={quotePrefix}
                  onChange={(e) => setQuotePrefix(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <Button loading={saving} onClick={handleSaveLocalization}>
                  Save changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Interface sounds</CardTitle>
              <CardDescription>
                Subtle audio feedback for actions like sending invoices and payments received. Off by default.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium">Enable sound effects</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Plays a short tone on success, notifications and completed actions.
                  </p>
                </div>
                <Switch
                  checked={soundEnabled}
                  onChange={(next) => {
                    setSoundEnabled(next);
                    if (next) setTimeout(() => play("success"), 50);
                  }}
                  aria-label="Enable interface sound effects"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Current plan</CardTitle>
              <CardDescription>You&apos;re on the Free plan — every core tool included.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{PLANS[0]!.name}</p>
                    <Badge variant="primary">Active</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{PLANS[0]!.tagline}</p>
                </div>
                <Link href="/pricing" className={buttonVariants({ variant: "outline" })}>
                  View plans
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
