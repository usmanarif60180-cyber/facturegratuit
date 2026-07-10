import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="container max-w-3xl py-20">
      <h1 className="text-4xl font-bold tracking-tight">About IVOXA</h1>
      <div className="prose prose-neutral mt-6 max-w-none text-muted-foreground dark:prose-invert">
        <p>
          IVOXA is being built to become one of the world&apos;s best AI-powered business platforms
          for freelancers, contractors, consultants, agencies and startups.
        </p>
        <p>
          Our first release focuses on doing invoicing and quotations extremely well, on an
          architecture designed to grow into a full AI business suite — CRM, inventory, projects,
          payments and more — without ever needing a rewrite.
        </p>
        <p>
          We believe great software should feel elegant, fast and intelligent, without the clutter
          that slows businesses down.
        </p>
      </div>
    </div>
  );
}
