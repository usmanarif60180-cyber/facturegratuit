import type { Metadata } from "next";
import { ShieldCheck, Lock, Sparkles, Globe2 } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { StatsSection } from "@/components/marketing/StatsSection";
import { AudienceStrip } from "@/components/marketing/AudienceStrip";
import { Card, CardContent } from "@/components/ui/Card";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "About IVOXA",
  description:
    "IVOXA's mission, values and commitment to privacy, security and simplicity — the AI business platform for freelancers, agencies and growing businesses.",
  path: "/about",
});

const VALUES = [
  { icon: Sparkles, title: "Simplicity first", description: "Powerful doesn't have to mean complicated. Every feature earns its place by making a real task simpler." },
  { icon: Lock, title: "Privacy by default", description: "Your business data belongs to you. We build access rules that keep it that way from the schema up." },
  { icon: ShieldCheck, title: "Security as a foundation", description: "Authentication, data isolation and validation aren't an afterthought — they're built into the architecture." },
  { icon: Globe2, title: "Built for the world", description: "No feature assumes one country, currency or language. Global by default, not by exception." },
];

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-16">
      <Breadcrumbs items={[{ name: "About", path: "/about" }]} />

      <h1 className="text-4xl font-bold tracking-tight">About IVOXA</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        IVOXA is the AI business platform for freelancers, contractors, consultants, agencies and
        startups — built to replace a tangle of disconnected tools with one intelligent workspace.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">Our mission</h2>
          <p className="mt-2 text-foreground/90">
            Give every freelancer and small business the same quality of business tooling that used
            to be reserved for companies with a finance department — without the complexity or the
            price tag.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">Our vision</h2>
          <p className="mt-2 text-foreground/90">
            One workspace that grows with a business from its first invoice to its hundredth
            employee — invoicing and quoting today, a full AI business suite over time.
          </p>
        </div>
      </div>

      <div className="mt-14">
        <h2 className="text-2xl font-bold tracking-tight">Why IVOXA exists</h2>
        <p className="mt-3 max-w-3xl text-foreground/90">
          Most small businesses end up stitching together an invoicing tool, a spreadsheet, a
          document generator and a handful of calculators just to keep basic operations running.
          Each tool is fine on its own; together, they create friction, duplicate data entry, and
          the kind of small inefficiencies that quietly cost hours every week. IVOXA exists to put
          all of it — invoicing, quoting, clients, expenses and AI assistance — in one place, built
          properly from the start rather than bolted together.
        </p>
      </div>

      <div className="mt-14">
        <h2 className="text-2xl font-bold tracking-tight">Core values</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {VALUES.map((value) => (
            <Card key={value.title}>
              <CardContent className="pt-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <value.icon className="h-4.5 w-4.5" />
                </div>
                <p className="text-sm font-semibold">{value.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-14 rounded-xl border border-border bg-surface p-8">
        <h2 className="text-xl font-bold tracking-tight">Our commitments</h2>
        <div className="mt-4 space-y-4 text-sm">
          <p>
            <strong>Privacy.</strong> We collect what&apos;s needed to run your workspace, nothing more.
            Your business data is never sold, and every document is scoped so only your organization
            can read or write it.
          </p>
          <p>
            <strong>Security.</strong> Authentication runs through Firebase, and every collection is
            protected by access rules that check organization membership on every read and write —
            not just at the UI layer.
          </p>
          <p>
            <strong>Simplicity.</strong> A new user should be able to send their first invoice within
            minutes of signing up, with no onboarding wizard standing in the way.
          </p>
        </div>
      </div>

      <div className="mt-14">
        <h2 className="text-2xl font-bold tracking-tight">Where we&apos;re headed</h2>
        <p className="mt-3 max-w-3xl text-foreground/90">
          Version 1 focuses on doing invoicing and quotations exceptionally well. The architecture
          underneath — organization-scoped data, a pluggable AI interface, currency- and
          language-agnostic documents — is built so CRM, inventory, projects and payments can join
          the same workspace over time, without a rewrite. Global expansion is part of the plan from
          day one, not a future migration.
        </p>
      </div>

      <div className="mt-16 border-t border-border pt-10">
        <AudienceStrip />
      </div>

      <div className="mt-10">
        <StatsSection />
      </div>
    </div>
  );
}
