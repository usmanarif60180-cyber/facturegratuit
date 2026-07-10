import type { Metadata } from "next";
import { SITE, absoluteUrl } from "@/config/site";

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
}

/**
 * Builds a fully-formed Next.js Metadata object — title, description,
 * canonical URL, Open Graph and Twitter card — from a single call. Every
 * page (marketing, blog, tools, country/landing pages) should route through
 * this so SEO fields never drift between pages.
 */
export function buildMetadata({
  title,
  description,
  path,
  image = "/og-image.png",
  type = "website",
  keywords,
  publishedTime,
  modifiedTime,
  authors,
  noIndex,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title === SITE.name ? title : `${title} · ${SITE.name}`;
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    title: fullTitle,
    description,
    keywords: keywords ?? [...SITE.keywords],
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && modifiedTime ? { modifiedTime } : {}),
      ...(type === "article" && authors ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
      site: SITE.twitterHandle,
    },
  };
}
