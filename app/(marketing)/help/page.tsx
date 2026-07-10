import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Help Center" };

const TOPICS = [
  {
    title: "Getting started",
    items: [
      "Creating your workspace",
      "Setting up your company profile",
      "Adding your first client",
    ],
  },
  {
    title: "Invoices & quotes",
    items: ["Creating an invoice", "Converting a quote to an invoice", "Sending and tracking payment status"],
  },
  {
    title: "Billing",
    items: ["Understanding the Free plan", "Upgrading your plan"],
  },
  {
    title: "Account & security",
    items: ["Resetting your password", "Verifying your email", "Managing team members"],
  },
];

export default function HelpPage() {
  return (
    <div className="container max-w-3xl py-20">
      <h1 className="text-4xl font-bold tracking-tight">Help Center</h1>
      <p className="mt-3 text-muted-foreground">
        Browse common topics, or{" "}
        <Link href="/contact" className="text-primary hover:underline">
          contact us
        </Link>{" "}
        directly.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {TOPICS.map((topic) => (
          <Card key={topic.title}>
            <CardContent className="pt-6">
              <h3 className="text-base font-semibold">{topic.title}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {topic.items.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
