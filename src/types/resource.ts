import type { ContentBlock } from "./blog";

export type ResourceKind = "invoice" | "quote" | "receipt" | "purchase-order" | "checklist";

export interface ResourceItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  kind: ResourceKind;
  variant?: "blank" | "example";
  content?: ContentBlock[];
}
