import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-20">
      <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>

      <div className="prose prose-neutral mt-8 max-w-none text-muted-foreground dark:prose-invert">
        <h2>1. Information we collect</h2>
        <p>
          We collect account information you provide (name, email), business data you create
          (invoices, quotes, clients, products, expenses), and basic usage data needed to operate
          the service.
        </p>

        <h2>2. How we use your information</h2>
        <p>
          Your data is used solely to provide and improve IVOXA — generating documents, securing
          your account, and communicating with you about your workspace.
        </p>

        <h2>3. Data storage &amp; security</h2>
        <p>
          Data is stored using Firebase (Google Cloud) with organization-scoped access rules, so
          only members of your organization can read or write your business data.
        </p>

        <h2>4. Your rights</h2>
        <p>
          You may access, export, correct or delete your data at any time from your account
          settings, or by contacting us.
        </p>

        <h2>5. Contact</h2>
        <p>Questions about this policy can be sent through our contact page.</p>
      </div>
    </div>
  );
}
