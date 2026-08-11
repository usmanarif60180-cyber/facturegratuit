// Mock data for ProFacture AI clone

export const features = [
  { title: "Professional invoicing", desc: "Beautiful, pixel-perfect invoices with multi-currency, multi-language and every tax system covered.", icon: "FileText" },
  { title: "Quotes that convert", desc: "Send polished quotations and turn accepted ones into invoices in a single click.", icon: "FileCheck2" },
  { title: "Client & product hub", desc: "Keep every client, product and service organized in one searchable workspace.", icon: "Users" },
  { title: "AI built in", desc: "An AI assistant woven into the platform, ready to draft, summarize and automate.", icon: "Sparkles" },
  { title: "Built for the world", desc: "Any country, currency, language or tax system — nothing is hardcoded.", icon: "Globe" },
  { title: "Enterprise-grade security", desc: "Firebase-backed authentication and strict, organization-scoped data access.", icon: "ShieldCheck" },
];

export const steps = [
  { n: 1, title: "Enter business info", desc: "Pick a client, add line items — or let AI draft them from a quick description." },
  { n: 2, title: "AI generates the invoice", desc: "Line items, tax and totals are structured automatically, ready to review." },
  { n: 3, title: "Preview & fine-tune", desc: "A pixel-perfect, client-ready preview — edit anything before it goes out." },
  { n: 4, title: "Send — and track payment", desc: "Email it in one click, then watch its status move from pending to paid." },
];

export const templates = [
  { code: "FR", title: "Facture France gratuite", desc: "SIRET/SIREN, TVA, mentions légales, adresse client et chantier, IBAN/RIB, signature et PDF A4.", cta: "Open France template" },
  { code: "US", title: "Free USA invoice", desc: "Simple professional invoice for US freelancers, LLCs, online services, product sales and multi-currency PDF exports.", cta: "Open USA template" },
  { code: "UK", title: "Free UK invoice", desc: "GBP-ready invoice for UK sole traders, small companies, service providers and marketplace sellers.", cta: "Open UK template" },
  { code: "DE", title: "Rechnung Deutschland", desc: "German-ready invoice page for international sellers, small businesses and professional PDF records.", cta: "Open German template" },
  { code: "€", title: "Factura España / Fattura Italia", desc: "Euro invoices for Spanish and Italian businesses with clean client data, article lines, VAT and totals.", cta: "Open Spain template" },
  { code: "AM", title: "Amazon seller invoice", desc: "Marketplace order ID, buyer reference, SKU/listing, payment method, delivery reference and informational fees.", cta: "Open Amazon template" },
  { code: "ET", title: "Etsy / eBay seller invoice", desc: "Designed for handmade shops, eBay resellers, online sellers and small product catalogs.", cta: "Open marketplace template" },
  { code: "AI", title: "AI invoice workflow", desc: "Draft line items from a description, review totals, adjust TVA/tax and download a professional PDF.", cta: "Open AI assistant" },
  { code: "CK", title: "Invoice checklist", desc: "Review invoice number, seller, client, chantier address, tax, due date, payment terms and PDF details before sending.", cta: "Open checklist" },
  { code: "WA", title: "Email & WhatsApp sending", desc: "Use ready message templates, share invoice details quickly and keep the client payment workflow clear.", cta: "Open sending guide" },
  { code: "SC", title: "Search indexing checklist", desc: "Understand sitemap, canonical, mobile, useful content and Search Console steps for invoice websites.", cta: "Open SEO checklist" },
  { code: "TL", title: "Full template library", desc: "One page linking country, business, building, automobile, freelance and marketplace invoice templates.", cta: "Open library" },
];

export const pricing = [
  { name: "Free", tagline: "Everything you need to get started", price: "$0", period: "/mo", features: ["20 invoices / month", "20 quotes / month", "Unlimited clients & products", "500 MB storage", "1 team member"], cta: "Commencer gratuitement", popular: false },
  { name: "Starter", tagline: "For freelancers going full-time", price: "$9", period: "/mo", features: ["Unlimited invoices & quotes", "5 GB storage", "3 team members", "Premium templates"], cta: "Coming soon", popular: true },
  { name: "Professional", tagline: "For growing agencies", price: "$29", period: "/mo", features: ["Everything in Starter", "50 GB storage", "API access"], cta: "Coming soon", popular: false },
  { name: "Business", tagline: "For established teams", price: "$79", period: "/mo", features: ["Everything in Professional", "500 GB storage", "Dedicated support"], cta: "Coming soon", popular: false },
];

export const blogPosts = [
  { tag: "Invoices", icon: "FileText", title: "How to Write an Invoice That Gets Paid Faster", desc: "The details that make clients pay on time.", author: "ProFacture AI Team", read: "4 min read" },
  { tag: "Taxes", icon: "Receipt", title: "VAT vs Sales Tax vs GST: What's the Difference?", desc: "A plain-English breakdown of three consumption taxes.", author: "ProFacture AI Team", read: "3 min read" },
  { tag: "Quotes", icon: "Calculator", title: "Quote vs Invoice: When to Use Each", desc: "How to use each one correctly in your sales process.", author: "ProFacture AI Team", read: "3 min read" },
  { tag: "AI", icon: "Sparkles", title: "5 Ways Freelancers Can Use AI", desc: "Clearing out admin without losing the personal touch.", author: "ProFacture AI Product", read: "4 min read" },
  { tag: "Accounting", icon: "BookOpen", title: "A Simple Bookkeeping System", desc: "Three habits that scale as your business grows.", author: "ProFacture AI Team", read: "3 min read" },
  { tag: "Construction", icon: "HardHat", title: "Avoiding Late Payments in Construction", desc: "Practices that shorten long payment cycles.", author: "ProFacture AI Team", read: "3 min read" },
  { tag: "Finance", icon: "Droplet", title: "Cash Flow 101", desc: "Why profitable businesses still run out of cash.", author: "ProFacture AI Team", read: "3 min read" },
  { tag: "Productivity", icon: "Timer", title: "10 Productivity Habits for Solo Founders", desc: "Protecting the hours that move the business forward.", author: "ProFacture AI Team", read: "4 min read" },
  { tag: "Guides", icon: "Hash", title: "The Complete Guide to Invoice Numbering", desc: "A consistent system prevents duplicates and gaps.", author: "ProFacture AI Team", read: "3 min read" },
];

export const languages = [
  { flag: "🇺🇸", name: "English (US)" },
  { flag: "🇬🇧", name: "English (UK)" },
  { flag: "🇫🇷", name: "Français" },
  { flag: "🇮🇹", name: "Italiano" },
  { flag: "🇪🇸", name: "Español" },
  { flag: "🇩🇪", name: "Deutsch" },
  { flag: "🇳🇱", name: "Nederlands" },
  { flag: "🇵🇹", name: "Português" },
  { flag: "🇵🇱", name: "Polski" },
];

export const dashboardStats = [
  { label: "Revenue", value: "$0.00", icon: "DollarSign" },
  { label: "Profit", value: "$0.00", icon: "TrendingUp" },
  { label: "Expenses", value: "$0.00", icon: "CreditCard" },
  { label: "Cash flow", value: "$0.00", icon: "Droplet" },
  { label: "Outstanding", value: "$0.00", icon: "Wallet" },
  { label: "Invoices", value: "0", icon: "FileText" },
  { label: "Quotes", value: "0", icon: "Receipt" },
  { label: "Clients", value: "0", icon: "Users" },
];
