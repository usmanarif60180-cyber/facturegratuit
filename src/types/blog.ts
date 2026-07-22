export type BlogCategory =
  | "AI"
  | "Business"
  | "Invoices"
  | "Quotes"
  | "Accounting"
  | "Taxes"
  | "Freelancing"
  | "Construction"
  | "Small Business"
  | "Finance"
  | "Productivity"
  | "Guides";

export type ContentBlock =
  | { type: "heading"; level: 2 | 3; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "quote"; text: string; cite?: string }
  | { type: "callout"; tone: "tip" | "warning" | "info"; text: string };

export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  tags: string[];
  authorSlug: string;
  publishedAt: string;
  updatedAt?: string;
  coverEmoji: string;
}

export interface BlogPostWithContent extends BlogPost {
  content: ContentBlock[];
}
