import type { HelpArticle } from "@/types/help";

export const HELP_ARTICLES: HelpArticle[] = [
  {
    slug: "creating-your-workspace",
    title: "Creating your workspace",
    description: "What happens when you sign up, and how your organization is set up automatically.",
    category: "Getting Started",
    content: [
      { type: "paragraph", text: "When you sign up for IVOXA — whether with email or Google — a workspace (your organization) is created for you automatically. There's no separate setup wizard to get through before you can create your first invoice." },
      { type: "heading", level: 2, text: "What gets created automatically", id: "auto" },
      { type: "list", items: [
        "A workspace with default currency, language and date format",
        "An invoice and quote numbering sequence, starting at 0001",
        "A Free plan subscription with no time limit",
        "Your user profile, with the Owner role",
      ] },
      { type: "heading", level: 2, text: "Next steps", id: "next" },
      { type: "paragraph", text: "Head to Settings to add your company name, logo and address — these appear on every invoice and quote you send. Then add your first client and product so they're ready to select when you build a document." },
    ],
  },
  {
    slug: "setting-up-your-company-profile",
    title: "Setting up your company profile",
    description: "Add the business details that appear on every invoice and quote.",
    category: "Getting Started",
    content: [
      { type: "paragraph", text: "Your company profile controls what clients see on the documents you send. Go to Settings → General to fill it in." },
      { type: "list", items: [
        "Business name and legal name (if different)",
        "Email, phone and country",
        "Tax ID or registration number, if applicable",
      ] },
      { type: "callout", tone: "tip", text: "Fill this in before sending your first invoice — it's much easier than editing already-sent documents." },
    ],
  },
  {
    slug: "creating-your-first-invoice",
    title: "Creating your first invoice",
    description: "A walkthrough of the invoice builder, from client selection to line items.",
    category: "Invoice Guides",
    content: [
      { type: "paragraph", text: "From the Invoices page, select New invoice. You'll need a client on file — add one first if you haven't already." },
      { type: "heading", level: 2, text: "Steps", id: "steps" },
      { type: "list", ordered: true, items: [
        "Select the client this invoice is for",
        "Set the issue date and due date",
        "Choose the currency",
        "Add line items — description, quantity, unit price, and tax rate if applicable",
        "Add any notes or terms",
        "Save as draft, or save and mark it pending to send",
      ] },
      { type: "callout", tone: "info", text: "The invoice number is reserved automatically the moment you save — you never need to set it manually." },
    ],
  },
  {
    slug: "understanding-invoice-statuses",
    title: "Understanding invoice statuses",
    description: "What each invoice status means and when it changes.",
    category: "Invoice Guides",
    content: [
      { type: "list", items: [
        "Draft — created but not yet sent to the client",
        "Pending — sent, awaiting payment",
        "Paid — payment received; the paid date is recorded automatically",
        "Overdue — past its due date and still unpaid",
        "Canceled — voided; kept for your records but excluded from revenue",
      ] },
      { type: "paragraph", text: "You can change an invoice's status at any time from its detail page using the Update status menu." },
    ],
  },
  {
    slug: "creating-a-quote-and-converting-it",
    title: "Creating a quote and converting it to an invoice",
    description: "Send a quote, get it accepted, and turn it into an invoice without re-entering anything.",
    category: "Quote Guides",
    content: [
      { type: "paragraph", text: "Quotes work the same way as invoices, with an expiry date instead of a due date. Once a client accepts a quote, open it and select Convert to invoice." },
      { type: "paragraph", text: "The new invoice keeps the same client, line items and totals, with a fresh invoice number and a reference back to the original quote. The quote itself is marked as converted so it won't be counted twice in your reports." },
    ],
  },
  {
    slug: "setting-up-tax-rates",
    title: "Setting up tax rates in IVOXA",
    description: "How VAT, GST and sales tax rates work on invoice and quote line items.",
    category: "Tax Basics",
    content: [
      { type: "paragraph", text: "Each line item on an invoice or quote can have its own tax rate — useful when different products or services are taxed differently." },
      { type: "paragraph", text: "IVOXA ships with a few common presets (No Tax, VAT 20%, GST 10%, Sales Tax 8%) that you can apply per line item. Totals — subtotal, discount, tax and grand total — recalculate automatically as you edit." },
      { type: "callout", tone: "warning", text: "Tax rules vary significantly by country. IVOXA calculates the tax you configure, but confirming the correct rate and reporting obligations for your business is your responsibility." },
    ],
  },
  {
    slug: "exporting-invoices-as-pdf",
    title: "Exporting and printing invoices as PDF",
    description: "Get a client-ready PDF of any invoice or quote.",
    category: "PDF Guides",
    content: [
      { type: "paragraph", text: "Open any invoice or quote and select Print / PDF. This opens your browser's print dialog with a clean, client-ready layout — choose 'Save as PDF' as the destination to download it, or print directly." },
      { type: "paragraph", text: "The exported document includes your company details, the client's information, line items, totals, and any notes or terms you've added." },
    ],
  },
  {
    slug: "getting-started-with-ai-assistant",
    title: "Getting started with the AI Assistant",
    description: "What the AI Assistant can help with today, and what's coming next.",
    category: "AI Features",
    content: [
      { type: "paragraph", text: "The AI Assistant lives in its own section of the app, with a set of capabilities — invoice drafting, email writing, reminders, tax questions and more — listed on the left." },
      { type: "callout", tone: "info", text: "Version 1 ships the full interface with each capability wired up and ready; full AI responses roll out as providers are connected in upcoming releases." },
    ],
  },
  {
    slug: "resetting-your-password",
    title: "Resetting your password",
    description: "Forgot your password? Here's how to get back in.",
    category: "Troubleshooting",
    content: [
      { type: "list", ordered: true, items: [
        "Go to the Login page and select 'Forgot password?'",
        "Enter the email address on your account",
        "Check your inbox for a reset link and follow it",
        "Sign in with your new password",
      ] },
      { type: "paragraph", text: "If you signed up with Google, use the 'Continue with Google' button instead — there's no separate IVOXA password to reset." },
    ],
  },
];

export function getHelpArticleBySlug(slug: string): HelpArticle | undefined {
  return HELP_ARTICLES.find((a) => a.slug === slug);
}

export function getHelpCategories(): HelpArticle["category"][] {
  return Array.from(new Set(HELP_ARTICLES.map((a) => a.category)));
}
