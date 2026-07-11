import { DesignableDocument } from "@/components/design/DesignableDocument";
import { invoiceToDesignableDoc } from "@/lib/design/documentAdapter";
import { DEFAULT_DESIGN_CONFIG } from "@/lib/design/defaults";
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
      design={organization?.designConfig ?? DEFAULT_DESIGN_CONFIG}
      brandKit={organization?.brandKit}
      locale={organization?.settings.defaultLanguage}
    />
  );
}
