import Link from "next/link";
import { Logo } from "./Logo";
import { NewsletterSignup } from "@/components/marketing/NewsletterSignup";
import { AdSlot } from "@/components/marketing/AdSlot";
import { COUNTRY_GUIDES } from "@/lib/content/countries/guides";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/tools", label: "Free Tools" },
      { href: "/resources", label: "Resources" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/help", label: "Help Center" },
      { href: "/invoice-generator", label: "Invoice Generator" },
    ],
  },
  {
    title: "Invoicing by country",
    links: COUNTRY_GUIDES.slice(0, 4).map((c) => ({ href: `/invoice-generator/${c.slug}`, label: c.name })),
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="container grid gap-10 py-14 lg:grid-cols-[1.4fr,1fr,1fr,1fr,1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            The AI Business Platform — invoicing, quotations and more, in one intelligent
            workspace.
          </p>
          <div className="mt-5 max-w-xs">
            <NewsletterSignup source="footer" compact />
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold">{col.title}</h4>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <AdSlot label="Footer advertisement" className="container pb-6" />
      <div className="border-t border-border py-6">
        <p className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} IVOXA. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
