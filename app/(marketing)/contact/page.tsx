import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Clock, HelpCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ContactForm } from "@/components/marketing/ContactForm";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with the IVOXA team — support, feedback and partnership questions.",
  path: "/contact",
});

const FAQ_LINKS = [
  { label: "Resetting your password", href: "/help/resetting-your-password" },
  { label: "Creating your first invoice", href: "/help/creating-your-first-invoice" },
  { label: "Setting up tax rates", href: "/help/setting-up-tax-rates" },
];

export default function ContactPage() {
  return (
    <div className="container max-w-4xl py-16">
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
      <h1 className="text-4xl font-bold tracking-tight">Get in touch</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Questions, feedback, or partnership ideas — we&apos;d love to hear from you.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr,20rem]">
        <ContactForm />

        <div className="space-y-8">
          <div className="flex gap-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold">Response time</p>
              <p className="mt-1 text-sm text-muted-foreground">
                We aim to reply within one business day. Support and product questions get priority.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold">Prefer email?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Use the form on this page — it routes straight to our team and keeps a record on
                both sides.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold">Common questions</p>
              <ul className="mt-2 space-y-1.5">
                {FAQ_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-primary hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/help" className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">
                Visit the Help Center →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
