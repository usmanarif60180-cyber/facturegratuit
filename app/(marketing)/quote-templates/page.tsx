import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingTemplate } from "@/components/marketing/LandingTemplate";
import { buildMetadata } from "@/lib/seo/metadata";
import { getLandingPage } from "@/lib/content/landing/pages";

const SLUG = "quote-templates";

export const metadata: Metadata = (() => {
  const content = getLandingPage(SLUG)!;
  return buildMetadata({ title: content.metaTitle, description: content.metaDescription, path: content.path });
})();

export default function Page() {
  const content = getLandingPage(SLUG);
  if (!content) notFound();
  return <LandingTemplate content={content} />;
}
