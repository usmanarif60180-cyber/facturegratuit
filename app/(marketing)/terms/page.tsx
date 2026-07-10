import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-20">
      <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>

      <div className="prose prose-neutral mt-8 max-w-none text-muted-foreground dark:prose-invert">
        <h2>1. Acceptance of terms</h2>
        <p>By creating an account or using IVOXA, you agree to these terms.</p>

        <h2>2. Your account</h2>
        <p>
          You are responsible for maintaining the security of your account and for all activity
          under it.
        </p>

        <h2>3. Acceptable use</h2>
        <p>
          You agree not to misuse the platform, including attempting to disrupt the service,
          access other organizations&apos; data, or use IVOXA for unlawful purposes.
        </p>

        <h2>4. Your content</h2>
        <p>
          You retain ownership of the business data you create. We do not claim ownership of your
          invoices, quotes, clients or other content.
        </p>

        <h2>5. Service availability</h2>
        <p>
          IVOXA is provided &quot;as is&quot;. We work to keep the service reliable but do not
          guarantee uninterrupted availability.
        </p>

        <h2>6. Changes</h2>
        <p>We may update these terms as the platform evolves. Continued use constitutes acceptance.</p>
      </div>
    </div>
  );
}
