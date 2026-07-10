import type { Metadata } from "next";
import {
  FileText,
  FileSpreadsheet,
  Users,
  Package,
  Receipt,
  BarChart3,
  Sparkles,
  Globe2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Features" };

const FEATURES = [
  {
    icon: FileText,
    title: "Invoicing",
    points: [
      "Professional templates with your logo and brand",
      "Multi-currency, multi-language, every tax system",
      "QR codes, signatures, notes and terms",
      "PDF export, print and duplicate",
      "Draft, pending, paid and overdue tracking",
    ],
  },
  {
    icon: FileSpreadsheet,
    title: "Quotations",
    points: ["Send polished quotes", "One-click convert to invoice", "Fully editable line items"],
  },
  {
    icon: Users,
    title: "Clients",
    points: ["Full client history", "Search and notes", "VAT and company numbers"],
  },
  {
    icon: Package,
    title: "Products & services",
    points: ["Categories, SKUs and pricing", "Reusable across invoices and quotes"],
  },
  {
    icon: Receipt,
    title: "Expenses",
    points: ["Track spending by category", "Attach receipts"],
  },
  {
    icon: BarChart3,
    title: "Reports",
    points: ["Revenue and outstanding payments", "Monthly statistics"],
  },
  {
    icon: Sparkles,
    title: "AI Assistant",
    points: ["Draft invoices and quotes with AI", "Write emails and reminders", "More capabilities on the way"],
  },
  {
    icon: Globe2,
    title: "Built for the world",
    points: ["Any country, currency or language", "Never hardcoded"],
  },
];

export default function FeaturesPage() {
  return (
    <div className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">Everything your business needs</h1>
        <p className="mt-4 text-muted-foreground">
          One workspace, built to replace the tangle of separate tools.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {FEATURES.map((f) => (
          <Card key={f.title}>
            <CardContent className="pt-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {f.points.map((p) => (
                  <li key={p}>· {p}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
