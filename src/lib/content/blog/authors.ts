import type { Author } from "@/types/blog";

export const AUTHORS: Author[] = [
  {
    slug: "ivoxa-team",
    name: "The IVOXA Team",
    role: "Product & Content",
    bio: "We build IVOXA and write about the invoicing, quoting and small-business questions we hear most often from the people using it.",
  },
  {
    slug: "ivoxa-product",
    name: "IVOXA Product",
    role: "Product Updates & AI",
    bio: "Notes from the team building IVOXA's AI and automation features — what's shipping, what's next, and how to get the most out of it.",
  },
];

export function getAuthor(slug: string): Author | undefined {
  return AUTHORS.find((a) => a.slug === slug);
}
