import type { LucideIcon } from "lucide-react";
import {
  Percent,
  TrendingUp,
  CalendarClock,
  AlertOctagon,
  Hash,
  ListOrdered,
  ArrowLeftRight,
  QrCode,
  Sparkles,
  Receipt,
} from "lucide-react";

/** Registry of Free Business Tools. Add a new tool by appending an entry here
 * and a matching component in src/components/tools — the hub and detail
 * pages render from this list automatically. */
export interface ToolDefinition {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: "Tax & Finance" | "Invoicing" | "Utilities";
  icon: LucideIcon;
}

export const TOOLS: ToolDefinition[] = [
  {
    slug: "tax-calculator",
    title: "VAT, GST & Sales Tax Calculator",
    shortTitle: "Tax Calculator",
    description: "Add or extract VAT, GST or sales tax from any amount, at any rate.",
    category: "Tax & Finance",
    icon: Percent,
  },
  {
    slug: "profit-margin-calculator",
    title: "Profit Margin Calculator",
    shortTitle: "Profit Margin",
    description: "Work out profit, margin and markup from cost and selling price.",
    category: "Tax & Finance",
    icon: TrendingUp,
  },
  {
    slug: "invoice-due-date-calculator",
    title: "Invoice Due Date Calculator",
    shortTitle: "Due Date Calculator",
    description: "Calculate an invoice due date from common payment terms like Net 30.",
    category: "Invoicing",
    icon: CalendarClock,
  },
  {
    slug: "late-payment-interest-calculator",
    title: "Late Payment Interest Calculator",
    shortTitle: "Late Payment Interest",
    description: "Calculate interest owed on an overdue invoice.",
    category: "Invoicing",
    icon: AlertOctagon,
  },
  {
    slug: "invoice-number-generator",
    title: "Invoice Number Generator",
    shortTitle: "Invoice Numbers",
    description: "Preview a clean, sequential invoice numbering pattern.",
    category: "Invoicing",
    icon: Hash,
  },
  {
    slug: "quote-number-generator",
    title: "Quote Number Generator",
    shortTitle: "Quote Numbers",
    description: "Preview a clean, sequential quote numbering pattern.",
    category: "Invoicing",
    icon: ListOrdered,
  },
  {
    slug: "currency-converter",
    title: "Currency Converter",
    shortTitle: "Currency Converter",
    description: "Convert between currencies using current exchange rates.",
    category: "Utilities",
    icon: ArrowLeftRight,
  },
  {
    slug: "qr-code-generator",
    title: "QR Code Generator",
    shortTitle: "QR Code Generator",
    description: "Turn a link, invoice number or payment note into a scannable QR code.",
    category: "Utilities",
    icon: QrCode,
  },
  {
    slug: "business-name-generator",
    title: "Business Name Generator",
    shortTitle: "Name Generator",
    description: "Generate business name ideas from a keyword and industry.",
    category: "Utilities",
    icon: Sparkles,
  },
  {
    slug: "business-expense-calculator",
    title: "Business Expense Calculator",
    shortTitle: "Expense Calculator",
    description: "Add up expenses by category to see where your money is going.",
    category: "Tax & Finance",
    icon: Receipt,
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
