import type { BlogCategory, BlogPostWithContent } from "@/types/blog";

export const BLOG_POSTS: BlogPostWithContent[] = [
  {
    slug: "how-to-write-an-invoice-that-gets-paid-faster",
    title: "How to Write an Invoice That Gets Paid Faster",
    description:
      "The details that make clients pay on time — from clear payment terms to the exact information an invoice needs to avoid delays.",
    category: "Invoices",
    tags: ["invoicing", "payments", "small business"],
    authorSlug: "ivoxa-team",
    publishedAt: "2026-05-04",
    coverEmoji: "📄",
    content: [
      { type: "paragraph", text: "Late payments are rarely about a client refusing to pay — they're usually about friction. A confusing invoice, a missing due date, or an unclear payment method can push your invoice to the bottom of someone's inbox. A handful of small changes can make yours easy to act on immediately." },
      { type: "heading", level: 2, text: "Put the essentials where they can't be missed", id: "essentials" },
      { type: "list", items: [
        "A clear invoice number, so both sides can reference it in emails",
        "The exact amount due, in a large, unambiguous font",
        "A due date — not just 'payment terms: Net 30' buried in fine print",
        "Your payment details (bank transfer, card link, or payment provider) right on the document",
      ] },
      { type: "heading", level: 2, text: "Set payment terms before the work starts", id: "terms" },
      { type: "paragraph", text: "The best time to agree on payment terms is before you start the project, not when the invoice lands. State the due date, any late fees, and accepted payment methods in your quote or contract so the invoice is simply confirming what was already agreed." },
      { type: "callout", tone: "tip", text: "Shorter terms get paid faster. 'Due on receipt' or 'Net 7' consistently outperforms 'Net 30' for small invoices — reserve longer terms for larger clients with formal AP processes." },
      { type: "heading", level: 2, text: "Make the invoice itself easy to trust", id: "trust" },
      { type: "paragraph", text: "Include your business name, address and tax/VAT number if applicable, and keep the design clean and consistent every time. Clients pay faster when an invoice looks like it came from an established, organized business — inconsistent formatting invites a second look, and a second look often means a delay." },
      { type: "heading", level: 2, text: "Follow up before it's overdue, not after", id: "follow-up" },
      { type: "paragraph", text: "A short, friendly reminder two or three days before the due date catches invoices that simply got buried, before they become an awkward 'this is overdue' conversation. IVOXA tracks due dates automatically so you always know what's coming up next." },
    ],
  },
  {
    slug: "vat-vs-sales-tax-vs-gst",
    title: "VAT vs Sales Tax vs GST: What's the Difference?",
    description:
      "A plain-English breakdown of the three most common consumption taxes businesses deal with, and which one applies to you.",
    category: "Taxes",
    tags: ["taxes", "vat", "gst", "international"],
    authorSlug: "ivoxa-team",
    publishedAt: "2026-05-11",
    coverEmoji: "🧾",
    content: [
      { type: "paragraph", text: "If you sell across borders, you'll eventually run into three different acronyms on invoices: VAT, GST and Sales Tax. They all tax consumption, but how and when they're collected is different enough that mixing them up can cause real compliance headaches." },
      { type: "heading", level: 2, text: "VAT (Value Added Tax)", id: "vat" },
      { type: "paragraph", text: "Used across the EU, UK and much of the world, VAT is collected at every stage of production — each business in the supply chain charges VAT on what it sells and reclaims the VAT it paid on what it bought. The end consumer effectively bears the full cost. Rates vary by country and sometimes by product category." },
      { type: "heading", level: 2, text: "GST (Goods and Services Tax)", id: "gst" },
      { type: "paragraph", text: "Used in countries like Canada, Australia, India, Singapore and New Zealand, GST works similarly to VAT — it's a multi-stage consumption tax with input credits — but the registration thresholds, filing cadence and rate structures differ by country, so 'GST' in Australia is not identical to 'GST' in Canada." },
      { type: "heading", level: 2, text: "Sales Tax (United States)", id: "sales-tax" },
      { type: "paragraph", text: "US sales tax is collected once, at the final point of sale to the consumer, rather than at every stage. It's set at the state (and often city/county) level, which means the same product can carry a different tax rate depending on where the buyer is located — one of the reasons US sales tax compliance is notoriously fragmented." },
      { type: "callout", tone: "info", text: "IVOXA's invoice builder supports custom tax rates per line item, so you can apply the correct VAT, GST or sales tax rate regardless of where your client is based." },
      { type: "heading", level: 2, text: "The practical takeaway", id: "takeaway" },
      { type: "paragraph", text: "If you sell internationally, don't assume one tax system's rules apply everywhere. Check the registration threshold and invoicing requirements for each country or state you do meaningful business in, and keep your invoices flexible enough to show the right tax label and rate for each client." },
    ],
  },
  {
    slug: "quote-vs-invoice-when-to-use-each",
    title: "Quote vs Invoice: When to Use Each (and How to Convert One Into the Other)",
    description:
      "Quotes and invoices look similar but serve different purposes in a sale. Here's how to use each one correctly.",
    category: "Quotes",
    tags: ["quotes", "invoicing", "sales process"],
    authorSlug: "ivoxa-team",
    publishedAt: "2026-05-18",
    coverEmoji: "🧮",
    content: [
      { type: "paragraph", text: "A quote and an invoice can list the exact same line items and still mean two completely different things to your client. Knowing when to send which one keeps your sales process — and your bookkeeping — clean." },
      { type: "heading", level: 2, text: "A quote is a proposal", id: "quote" },
      { type: "paragraph", text: "Send a quote before work begins, when a client wants to know what something will cost. It's not a request for payment — it's a commitment on price that the client can accept, negotiate, or decline. Quotes typically include an expiry date, since costs and availability can change." },
      { type: "heading", level: 2, text: "An invoice is a request for payment", id: "invoice" },
      { type: "paragraph", text: "Once a quote is accepted and the work is delivered (or a milestone reached), it becomes an invoice — a formal request for payment with a due date. This is the document that belongs in your accounting records as revenue owed." },
      { type: "heading", level: 2, text: "Converting a quote into an invoice", id: "convert" },
      { type: "list", items: [
        "Keep the same line items so there are no surprises for the client",
        "Add an issue date and due date in place of the quote's expiry date",
        "Reference the original quote number for a clean paper trail",
        "Only convert once the client has actually accepted the quote",
      ] },
      { type: "callout", tone: "tip", text: "In IVOXA, open any accepted quote and choose 'Convert to invoice' — the client, line items and totals carry over automatically, and the quote is marked as converted so nothing gets double-counted." },
    ],
  },
  {
    slug: "ai-tools-every-freelancer-should-use",
    title: "5 Ways Freelancers Can Use AI Without Losing the Personal Touch",
    description:
      "AI can take the repetitive admin off a freelancer's plate — drafting, summarizing, reminders — while leaving the client relationship exactly as personal as before.",
    category: "AI",
    tags: ["ai", "freelancing", "productivity"],
    authorSlug: "ivoxa-product",
    publishedAt: "2026-05-25",
    coverEmoji: "✨",
    content: [
      { type: "paragraph", text: "The best use of AI for a freelancer isn't replacing client conversations — it's clearing out the admin that eats into billable time. Here's where it tends to help most." },
      { type: "heading", level: 2, text: "1. First drafts, not final copy", id: "drafts" },
      { type: "paragraph", text: "A first draft of a project proposal, a follow-up email, or a scope-of-work document is the hardest part to start. Let AI produce the skeleton, then edit it into your own voice — you'll almost always finish faster than starting from a blank page." },
      { type: "heading", level: 2, text: "2. Payment reminders that stay polite", id: "reminders" },
      { type: "paragraph", text: "Chasing late payments is uncomfortable, and that discomfort often means reminders go out later than they should. A generated first draft of a reminder — professional, firm, not passive-aggressive — makes it much easier to actually hit send on time." },
      { type: "heading", level: 2, text: "3. Turning notes into a quote", id: "quotes" },
      { type: "paragraph", text: "Messy call notes or a scope discussion in Slack can be turned into a structured line-item quote in a fraction of the time it takes to build one from scratch." },
      { type: "heading", level: 2, text: "4. Product and service descriptions", id: "descriptions" },
      { type: "paragraph", text: "If you sell the same few services repeatedly, a generated description you can quickly edit saves the time of writing (and rewriting) similar copy for every proposal." },
      { type: "heading", level: 2, text: "5. Business questions, answered in context", id: "questions" },
      { type: "paragraph", text: "Quick questions — 'what should my late fee be,' 'how do I word this scope change' — are exactly what a business-context AI assistant is for, without needing to leave your workspace." },
      { type: "callout", tone: "info", text: "IVOXA's AI Assistant is being built around exactly these workflows — drafting, reminders and business questions, inside the same workspace as your invoices and quotes." },
    ],
  },
  {
    slug: "simple-bookkeeping-system-for-small-businesses",
    title: "A Simple Bookkeeping System for Small Businesses",
    description:
      "You don't need complex accounting software on day one. Here's a minimal system that scales as your business grows.",
    category: "Accounting",
    tags: ["accounting", "bookkeeping", "small business"],
    authorSlug: "ivoxa-team",
    publishedAt: "2026-06-01",
    coverEmoji: "📚",
    content: [
      { type: "paragraph", text: "Most small businesses don't need a full accounting system in their first year — they need three habits done consistently. Get these right and adding proper accounting software later is easy." },
      { type: "heading", level: 2, text: "1. Separate your accounts", id: "separate" },
      { type: "paragraph", text: "A dedicated business bank account, even for a sole proprietor, is the single highest-leverage bookkeeping decision you can make. It turns your bank statement into a ready-made record of business income and expenses." },
      { type: "heading", level: 2, text: "2. Record income and expenses weekly", id: "record" },
      { type: "paragraph", text: "Reconciling once a week takes minutes. Reconciling once a quarter takes hours and invites mistakes. Every invoice you issue and every expense you incur should be logged close to when it happens." },
      { type: "heading", level: 2, text: "3. Keep every invoice and receipt", id: "keep" },
      { type: "paragraph", text: "Tax authorities generally expect records for several years. Store invoices and receipts digitally from day one — a folder per year, or a tool that keeps them attached to the transaction, saves enormous stress at tax time." },
      { type: "list", items: [
        "Issue every invoice through one system, so numbering never conflicts",
        "Track expenses by category as you go, not in a year-end scramble",
        "Reconcile bank transactions weekly, not monthly",
        "Export a simple profit and loss summary before every tax deadline",
      ] },
      { type: "callout", tone: "tip", text: "IVOXA's Expenses and Reports modules are designed for exactly this rhythm — log as you go, and your revenue, expenses and outstanding invoices stay accurate without a separate spreadsheet." },
    ],
  },
  {
    slug: "how-construction-contractors-can-avoid-late-payments",
    title: "How Construction Contractors Can Avoid Late Payments",
    description:
      "Construction has some of the longest payment cycles of any industry. These practices shorten them.",
    category: "Construction",
    tags: ["construction", "invoicing", "cash flow"],
    authorSlug: "ivoxa-team",
    publishedAt: "2026-06-08",
    coverEmoji: "🏗️",
    content: [
      { type: "paragraph", text: "Between multi-party approvals, retainage, and long project timelines, construction payment cycles are naturally slower than most industries. The contractors who get paid fastest aren't the ones with the strictest terms — they're the ones with the clearest paperwork." },
      { type: "heading", level: 2, text: "Bill in stages, not all at once", id: "stages" },
      { type: "paragraph", text: "Milestone or progress billing — invoicing as phases of work complete — keeps cash flowing through a long project instead of leaving you exposed until final completion. Tie each invoice to a clearly defined, client-agreed milestone." },
      { type: "heading", level: 2, text: "Document scope changes before you build them", id: "scope-changes" },
      { type: "paragraph", text: "Change orders are where payment disputes usually start. A quick written quote for the additional work, approved before it begins, prevents the 'we never agreed to that' conversation at invoice time." },
      { type: "heading", level: 2, text: "Make retainage terms explicit", id: "retainage" },
      { type: "paragraph", text: "If a percentage of payment is held back until project completion, state the percentage and the release condition directly on your contract and invoices — don't leave it as a verbal understanding." },
      { type: "list", items: [
        "Invoice against agreed milestones, not a single lump sum at the end",
        "Get change orders signed off before starting extra work",
        "State retainage percentage and release terms in writing",
        "Send lien notices on schedule where required by local law",
      ] },
    ],
  },
  {
    slug: "cash-flow-101",
    title: "Cash Flow 101: Understanding Money In vs Money Out",
    description:
      "Profitable businesses run out of cash all the time. Here's the difference between profit and cash flow, and why it matters.",
    category: "Finance",
    tags: ["finance", "cash flow", "small business"],
    authorSlug: "ivoxa-team",
    publishedAt: "2026-06-15",
    coverEmoji: "💧",
    content: [
      { type: "paragraph", text: "A business can be profitable on paper and still run out of money to pay its bills. That gap between profit and cash is exactly what cash flow measures, and it's one of the most common reasons small businesses struggle even while growing." },
      { type: "heading", level: 2, text: "Profit is not the same as cash", id: "profit-vs-cash" },
      { type: "paragraph", text: "Profit counts revenue the moment you invoice it. Cash flow only counts money once it actually lands in your account. If your clients pay on Net 60 terms but your suppliers expect payment in 15 days, you can be profitable every month and still short on cash." },
      { type: "heading", level: 2, text: "The three things that drive cash flow", id: "drivers" },
      { type: "list", items: [
        "How fast clients pay you (your accounts receivable cycle)",
        "How fast you have to pay suppliers and expenses",
        "How much cash is tied up in unbilled work or inventory",
      ] },
      { type: "heading", level: 2, text: "Simple ways to improve it", id: "improve" },
      { type: "paragraph", text: "Shorten your payment terms where you can, invoice as soon as work is delivered rather than batching it at month-end, and track outstanding invoices closely so nothing slips past its due date unnoticed. None of these require new revenue — they just get your existing revenue into your account faster." },
      { type: "callout", tone: "tip", text: "The Dashboard and Reports pages in IVOXA separate 'revenue' from 'outstanding' for exactly this reason — so you can see what's earned versus what's actually been collected." },
    ],
  },
  {
    slug: "productivity-habits-for-solo-founders",
    title: "10 Productivity Habits for Solo Founders",
    description:
      "Running a business alone means every hour matters. These habits protect the ones that matter most.",
    category: "Productivity",
    tags: ["productivity", "solo founders", "freelancing"],
    authorSlug: "ivoxa-team",
    publishedAt: "2026-06-22",
    coverEmoji: "⏱️",
    content: [
      { type: "paragraph", text: "Solo founders don't have a productivity problem so much as a prioritization problem — there's always more to do than time to do it. These habits are less about doing more and more about protecting the hours that actually move the business forward." },
      { type: "list", ordered: true, items: [
        "Batch admin work (invoicing, expenses, email) into one or two blocks a week instead of letting it interrupt every day",
        "Invoice the moment work is delivered — delayed invoicing is delayed income",
        "Keep a single source of truth for clients and projects instead of scattering notes across tools",
        "Set a weekly 'money hour' to review outstanding invoices, upcoming due dates and cash position",
        "Automate anything that repeats more than twice — reminders, recurring invoices, standard quotes",
        "Protect a daily block of uninterrupted work before checking email or messages",
        "Say no to scope creep in writing, with a quick change-order quote instead of a verbal 'sure, no problem'",
        "Review last month's numbers before planning next month's work",
        "Keep a template library for quotes, invoices and common client emails",
        "Take stock quarterly — what's working, what's taking too long, what should stop",
      ] },
      { type: "callout", tone: "info", text: "Habit five is where most of the time savings live: recurring templates and automated reminders remove dozens of small manual tasks a month without any extra effort." },
    ],
  },
  {
    slug: "complete-guide-to-invoice-numbering-systems",
    title: "The Complete Guide to Invoice Numbering Systems",
    description:
      "A consistent invoice numbering system prevents duplicate numbers, simplifies audits, and looks more professional. Here's how to set one up.",
    category: "Guides",
    tags: ["invoicing", "guides", "accounting"],
    authorSlug: "ivoxa-team",
    publishedAt: "2026-06-29",
    coverEmoji: "🔢",
    content: [
      { type: "paragraph", text: "Invoice numbers seem trivial until two invoices share the same number, or a tax authority asks for a sequential record and yours has gaps. A clear numbering system, set up once, avoids both problems permanently." },
      { type: "heading", level: 2, text: "Why sequential numbering matters", id: "why" },
      { type: "paragraph", text: "Most tax jurisdictions expect invoice numbers to be unique and, ideally, sequential with no gaps — it's one of the ways authorities check that revenue isn't being under-reported. Skipping numbers or reusing them can raise red flags in an audit even when nothing improper happened." },
      { type: "heading", level: 2, text: "Common numbering formats", id: "formats" },
      { type: "list", items: [
        "Simple sequential: INV-0001, INV-0002, INV-0003",
        "Year-prefixed: 2026-0001, 2026-0002 — resets each year, keeps years easy to scan",
        "Client-prefixed: ACME-0001 — useful for freelancers billing very few repeat clients",
        "Project-based: PRJ204-01 — ties invoices to a specific engagement",
      ] },
      { type: "heading", level: 2, text: "Rules worth following regardless of format", id: "rules" },
      { type: "list", items: [
        "Never reuse a number, even for a voided or canceled invoice",
        "Never manually edit a number after it's issued — cancel and reissue instead",
        "Keep quotes and invoices on separate numbering sequences",
        "Pick a format before your first invoice — changing formats mid-year is messy",
      ] },
      { type: "callout", tone: "tip", text: "IVOXA reserves the next invoice number automatically the moment you create an invoice, so numbers are always sequential and never collide — even with multiple team members creating invoices at once." },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPostWithContent | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPostWithContent, limit = 3): BlogPostWithContent[] {
  return BLOG_POSTS.filter((p) => p.slug !== post.slug)
    .map((p) => ({
      post: p,
      score: (p.category === post.category ? 2 : 0) + p.tags.filter((t) => post.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.post);
}

export function estimateReadingMinutes(post: BlogPostWithContent): number {
  const words = post.content
    .map((block) => {
      if (block.type === "paragraph" || block.type === "quote" || block.type === "callout") return block.text;
      if (block.type === "heading") return block.text;
      if (block.type === "list") return block.items.join(" ");
      return "";
    })
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function categorySlug(category: BlogCategory): string {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export function categoryFromSlug(slug: string): BlogCategory | undefined {
  const categories = Array.from(new Set(BLOG_POSTS.map((p) => p.category)));
  return categories.find((c) => categorySlug(c) === slug);
}

export function getPostsByCategory(category: BlogCategory): BlogPostWithContent[] {
  return BLOG_POSTS.filter((p) => p.category === category);
}

export function getPostsByAuthor(authorSlug: string): BlogPostWithContent[] {
  return BLOG_POSTS.filter((p) => p.authorSlug === authorSlug);
}

export function getAllCategories(): BlogCategory[] {
  return Array.from(new Set(BLOG_POSTS.map((p) => p.category)));
}
