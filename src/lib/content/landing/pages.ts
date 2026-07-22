import {
  Sparkles,
  FileText,
  FileSpreadsheet,
  Download,
  LayoutDashboard,
  Users,
  Receipt,
  Bot,
  Wand2,
  Clock,
  Printer,
  Palette,
  BarChart3,
  History,
  Search,
  Tag,
  ArrowRightLeft,
  Layers,
} from "lucide-react";
import type { LandingContent } from "@/types/landing";

export const LANDING_PAGES: Record<string, LandingContent> = {
  "ai-invoice-generator": {
    slug: "ai-invoice-generator",
    path: "/ai-invoice-generator",
    eyebrow: "AI Invoice Generator",
    title: "Generate invoices in seconds with AI",
    description:
      "Turn a quick description of the work into a structured, ready-to-send invoice — line items, totals and tax included.",
    metaTitle: "AI Invoice Generator — Create Invoices in Seconds",
    metaDescription: "Generate professional invoices with AI. Describe the work, get a structured invoice with line items and totals — free to start.",
    primaryCtaLabel: "Try the AI Assistant",
    primaryCtaHref: "/register",
    secondaryCtaLabel: "See how invoicing works",
    secondaryCtaHref: "/invoice-generator",
    features: [
      { icon: Wand2, title: "Describe, don't type", description: "Turn a rough description of the work into structured line items." },
      { icon: FileText, title: "Still fully editable", description: "Every generated invoice lands in the same builder you can fine-tune by hand." },
      { icon: Sparkles, title: "Built into your workspace", description: "No separate app — AI lives right next to your invoices and clients." },
      { icon: Clock, title: "Saves the blank-page time", description: "Skip the slowest part of invoicing: getting started." },
    ],
    faqs: [
      { question: "Is the AI invoice generator available now?", answer: "The AI Assistant interface and workflow are live today; full generative responses roll out as AI providers are connected in upcoming releases." },
      { question: "Can I edit an AI-generated invoice?", answer: "Yes — AI-assisted invoices open in the same editable builder as any other invoice, so you're always in control of the final version." },
    ],
  },

  "ai-quote-generator": {
    slug: "ai-quote-generator",
    path: "/ai-quote-generator",
    eyebrow: "AI Quote Generator",
    title: "Draft client-ready quotes with AI",
    description:
      "Turn call notes or a scope discussion into a structured quotation — ready to review, adjust and send.",
    metaTitle: "AI Quote Generator — Draft Quotes in Seconds",
    metaDescription: "Generate professional quotations with AI from a quick project description — free to start with IVOXA.",
    primaryCtaLabel: "Try the AI Assistant",
    primaryCtaHref: "/register",
    secondaryCtaLabel: "See how quoting works",
    secondaryCtaHref: "/quote-templates",
    features: [
      { icon: Wand2, title: "From notes to quote", description: "Messy scope notes become structured line items in moments." },
      { icon: FileSpreadsheet, title: "One-click convert", description: "Accepted quotes convert straight into invoices, no re-entry." },
      { icon: Sparkles, title: "Business-context AI", description: "The assistant understands your clients, products and past quotes." },
      { icon: Clock, title: "Faster proposals win more work", description: "Send a polished quote while the conversation is still fresh." },
    ],
    faqs: [
      { question: "Does the AI understand my existing products?", answer: "The AI Assistant is being built to draw on your saved clients and products, so generated quotes reflect your actual catalog." },
    ],
  },

  "pdf-invoice-generator": {
    slug: "pdf-invoice-generator",
    path: "/pdf-invoice-generator",
    eyebrow: "PDF Invoice Generator",
    title: "Create pixel-perfect PDF invoices",
    description:
      "Build an invoice in the browser and export a clean, professional PDF your clients can open anywhere — no design work required.",
    metaTitle: "PDF Invoice Generator — Free Online Invoice to PDF",
    metaDescription: "Create professional invoices online and export them as a clean PDF, ready to email or print — free with IVOXA.",
    primaryCtaLabel: "Create a PDF invoice",
    primaryCtaHref: "/register",
    secondaryCtaLabel: "Preview a template",
    secondaryCtaHref: "/resources/invoice-template",
    features: [
      { icon: Printer, title: "One-click export", description: "Print or 'Save as PDF' straight from the invoice preview." },
      { icon: Palette, title: "Your branding", description: "Logo, business name and address, laid out cleanly every time." },
      { icon: FileText, title: "Consistent formatting", description: "Every invoice follows the same professional layout — no manual design." },
      { icon: Layers, title: "Duplicate in one click", description: "Reuse a past invoice as the starting point for a new one." },
    ],
  },

  "free-quote-generator": {
    slug: "free-quote-generator",
    path: "/free-quote-generator",
    eyebrow: "Free Quote Generator",
    title: "Create professional quotes, free",
    description:
      "Build client-ready quotations with line items, tax and terms — free to use, with a one-click path to invoicing once accepted.",
    metaTitle: "Free Quote Generator — Create Quotations Online",
    metaDescription: "Create professional quotations online for free. Convert accepted quotes into invoices instantly with IVOXA.",
    primaryCtaLabel: "Create a free quote",
    primaryCtaHref: "/register",
    secondaryCtaLabel: "Preview a template",
    secondaryCtaHref: "/resources/quote-template",
    features: [
      { icon: FileSpreadsheet, title: "Professional layout", description: "Clean, consistent quotes that look the same every time." },
      { icon: ArrowRightLeft, title: "Convert to invoice", description: "Accepted quotes become invoices with one click — no re-entry." },
      { icon: Tag, title: "Line-item tax & discounts", description: "Apply tax rates and discounts per line, automatically totaled." },
      { icon: Clock, title: "Expiry dates built in", description: "Every quote tracks its own validity window." },
    ],
  },

  "invoice-templates": {
    slug: "invoice-templates",
    path: "/invoice-templates",
    eyebrow: "Invoice Templates",
    title: "Free invoice templates, ready to use",
    description:
      "Professional invoice templates you can preview, print, or build directly in IVOXA with your own branding and live totals.",
    metaTitle: "Free Invoice Templates — Print or Use Online",
    metaDescription: "Browse free, professional invoice templates. Preview, print, or build one with your own branding in IVOXA.",
    primaryCtaLabel: "Browse invoice templates",
    primaryCtaHref: "/resources/invoice-template",
    secondaryCtaLabel: "Create one in IVOXA",
    secondaryCtaHref: "/register",
    features: [
      { icon: FileText, title: "Blank & filled examples", description: "See a blank template and a fully filled-in example side by side." },
      { icon: Download, title: "Print or save as PDF", description: "Every template is print-ready straight from your browser." },
      { icon: Palette, title: "Add your own branding", description: "Bring the template into IVOXA to add your logo and details." },
      { icon: History, title: "Reusable every time", description: "Save your details once, then reuse the same template for every client." },
    ],
  },

  "quote-templates": {
    slug: "quote-templates",
    path: "/quote-templates",
    eyebrow: "Quote Templates",
    title: "Free quotation templates, ready to use",
    description:
      "Professional quote templates you can preview, print, or build directly in IVOXA — with a one-click path to invoicing.",
    metaTitle: "Free Quote Templates — Print or Use Online",
    metaDescription: "Browse free, professional quotation templates. Preview, print, or build one with your own branding in IVOXA.",
    primaryCtaLabel: "Browse quote templates",
    primaryCtaHref: "/resources/quote-template",
    secondaryCtaLabel: "Create one in IVOXA",
    secondaryCtaHref: "/register",
    features: [
      { icon: FileSpreadsheet, title: "Blank & filled examples", description: "See a blank template and a fully filled-in example side by side." },
      { icon: Download, title: "Print or save as PDF", description: "Every template is print-ready straight from your browser." },
      { icon: ArrowRightLeft, title: "Convert when accepted", description: "Move from quote to invoice without retyping anything." },
    ],
  },

  "business-dashboard": {
    slug: "business-dashboard",
    path: "/business-dashboard",
    eyebrow: "Business Dashboard",
    title: "See your whole business at a glance",
    description:
      "Revenue, outstanding payments, invoices, quotes and clients — one dashboard, updated in real time as you work.",
    metaTitle: "Business Dashboard — Real-Time Revenue & Invoice Tracking",
    metaDescription: "Track revenue, outstanding payments, invoices and clients in one real-time business dashboard — free with IVOXA.",
    primaryCtaLabel: "See your dashboard",
    primaryCtaHref: "/register",
    features: [
      { icon: LayoutDashboard, title: "Live stats", description: "Revenue, outstanding balance, invoice and quote counts, updated instantly." },
      { icon: BarChart3, title: "Revenue chart", description: "A rolling six-month view of paid revenue, at a glance." },
      { icon: History, title: "Recent activity", description: "See your latest invoices and their status without leaving the dashboard." },
      { icon: Sparkles, title: "Quick actions", description: "Jump straight into a new invoice, quote, client or product." },
    ],
  },

  "ai-business-assistant": {
    slug: "ai-business-assistant",
    path: "/ai-business-assistant",
    eyebrow: "AI Business Assistant",
    title: "An AI assistant that knows your business",
    description:
      "Draft emails, reminders, invoices and quotes, or ask business and tax questions — all inside the same workspace as your data.",
    metaTitle: "AI Business Assistant — Built Into Your Workspace",
    metaDescription: "An AI assistant for invoicing, quoting, email drafting and business questions — built into the IVOXA workspace.",
    primaryCtaLabel: "Meet the AI Assistant",
    primaryCtaHref: "/ai-assistant",
    secondaryCtaLabel: "Start free",
    secondaryCtaHref: "/register",
    features: [
      { icon: Bot, title: "One assistant, many jobs", description: "Invoice drafts, email writing, reminders, tax questions and more." },
      { icon: Sparkles, title: "In context, not in isolation", description: "It sits next to your real clients, invoices and quotes." },
      { icon: Wand2, title: "Drafts you edit, not replace", description: "Every generated draft opens in a fully editable document." },
      { icon: Clock, title: "Built for growth", description: "New capabilities roll out into the same interface over time." },
    ],
  },

  "client-management": {
    slug: "client-management",
    path: "/client-management",
    eyebrow: "Client Management",
    title: "Every client relationship, organized in one place",
    description:
      "Contact details, invoice history and notes for every client — searchable, and connected to every invoice and quote you send.",
    metaTitle: "Client Management Software — Free with IVOXA",
    metaDescription: "Manage clients, contact details and invoice history in one searchable workspace — free with IVOXA.",
    primaryCtaLabel: "Add your first client",
    primaryCtaHref: "/register",
    features: [
      { icon: Users, title: "Full client profiles", description: "Contact details, address, VAT number and notes in one place." },
      { icon: History, title: "Invoice history per client", description: "See every invoice sent to a client without searching." },
      { icon: Search, title: "Fast search", description: "Find any client in seconds as your list grows." },
      { icon: FileText, title: "Connected everywhere", description: "Clients are one click away when building an invoice or quote." },
    ],
  },

  "expense-tracking": {
    slug: "expense-tracking",
    path: "/expense-tracking",
    eyebrow: "Expense Tracking",
    title: "Track spending without a spreadsheet",
    description:
      "Log expenses by category as they happen, and see exactly where your money is going alongside your revenue.",
    metaTitle: "Expense Tracking Software — Free with IVOXA",
    metaDescription: "Track business expenses by category and see them alongside your revenue — free with IVOXA.",
    primaryCtaLabel: "Start tracking expenses",
    primaryCtaHref: "/register",
    secondaryCtaLabel: "Try the expense calculator",
    secondaryCtaHref: "/tools/business-expense-calculator",
    features: [
      { icon: Receipt, title: "Log as you go", description: "Add an expense in seconds — title, category, amount, date." },
      { icon: BarChart3, title: "See it next to revenue", description: "Reports combine expenses and revenue for a clear net picture." },
      { icon: Tag, title: "Category breakdown", description: "Understand exactly where spending concentrates." },
    ],
  },
};

export function getLandingPage(slug: string): LandingContent | undefined {
  return LANDING_PAGES[slug];
}
