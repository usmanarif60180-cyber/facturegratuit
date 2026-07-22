/** Central site-wide constants used by every metadata and schema generator. */
export const SITE = {
  name: "IVOXA",
  tagline: "The AI Business Platform",
  description:
    "IVOXA is the AI-powered business platform for freelancers, agencies and growing businesses — invoicing, quotations, clients and AI tools, in one intelligent workspace.",
  url: (process.env.NEXT_PUBLIC_APP_URL ?? "https://ivoxa.com").replace(/\/$/, ""),
  twitterHandle: "@ivoxa",
  locale: "en_US",
  keywords: [
    "invoicing software",
    "AI invoice generator",
    "quotation software",
    "free invoice generator",
    "business management platform",
    "invoice templates",
  ],
} as const;

export function absoluteUrl(path: string): string {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
