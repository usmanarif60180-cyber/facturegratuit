import type { ContentBlock } from "./blog";

export type HelpCategory =
  | "Getting Started"
  | "Invoice Guides"
  | "Quote Guides"
  | "Tax Basics"
  | "PDF Guides"
  | "AI Features"
  | "Troubleshooting";

export interface HelpArticle {
  slug: string;
  title: string;
  description: string;
  category: HelpCategory;
  content: ContentBlock[];
}
