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
import { PLANS } from "@/config/plans";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

export default function SettingsPage() {
  const { organization, loading } = useOrganization();
  const { toast } = useToast();
  const { enabled: soundEnabled, setEnabled: setSoundEnabled, play } = useSound();
  const [saving, setSaving] = React.useState(false);

  const [name, setName] = React.useState("");
  const [legalName, setLegalName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [countryCode, setCountryCode] = React.useState("");
  const [currency, setCurrency] = React.useState("USD");
  const [language, setLanguage] = React.useState("en");
  const [invoicePrefix, setInvoicePrefix] = React.useState("INV-");
  const [quotePrefix, setQuotePrefix] = React.useState("QUO-");

  React.useEffect(() => {
    if (!organization) return;
    setName(organization.name ?? "");
    setLegalName(organization.legalName ?? "");
    setEmail(organization.email ?? "");
    setPhone(organization.phone ?? "");
    setCountryCode(organization.address?.countryCode ?? "");
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
        email: email || undefined,
        phone: phone || undefined,
        address: { ...organization.address, countryCode: countryCode || undefined },
      });
      toast({ variant: "success", title: "Organization updated" });
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
      <PageHeader title="Settings" description="Manage your workspace, preferences and billing." />

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
              <CardDescription>Shown on your invoices and quotes.</CardDescription>
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
