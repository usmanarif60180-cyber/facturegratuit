import { DesignableDocument } from "@/components/design/DesignableDocument";
import { invoiceToDesignableDoc } from "@/lib/design/documentAdapter";
import { resolveDesignConfig } from "@/lib/design/resolve";
import type { Client, Invoice, Organization } from "@/types";

interface InvoicePreviewProps {
  invoice: Invoice;
  client: Client | null;
  organization: Organization | null;
}

export function InvoicePreview({ invoice, client, organization }: InvoicePreviewProps) {
  return (
    <DesignableDocument
      doc={invoiceToDesignableDoc(invoice)}
      client={client}
      organization={organization}
      design={resolveDesignConfig(organization, "invoice")}
      brandKit={organization?.brandKit}
      locale={organization?.settings.defaultLanguage}
    />
  );
}
