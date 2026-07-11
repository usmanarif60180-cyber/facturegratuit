import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/Providers";
import { JsonLd } from "@/components/seo/JsonLd";
import { Analytics } from "@/components/analytics/Analytics";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";
import { SITE, absoluteUrl } from "@/config/site";
import { FONT_VARIABLE_CLASS } from "@/lib/design/fonts";
import { cn } from "@/lib/utils/cn";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE.url,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: absoluteUrl("/og-image.png"), width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitterHandle,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fc" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1120" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans", FONT_VARIABLE_CLASS)}>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Analytics />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
