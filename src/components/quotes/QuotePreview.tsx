import { DesignableDocument } from "@/components/design/DesignableDocument";
import { quoteToDesignableDoc } from "@/lib/design/documentAdapter";
import { DEFAULT_DESIGN_CONFIG } from "@/lib/design/defaults";
import type { Client, Organization, Quote } from "@/types";

interface QuotePreviewProps {
  quote: Quote;
  client: Client | null;
  organization: Organization | null;
}

export function QuotePreview({ quote, client, organization }: QuotePreviewProps) {
  return (
    <DesignableDocument
      doc={quoteToDesignableDoc(quote)}
      client={client}
      organization={organization}
      design={organization?.designConfig ?? DEFAULT_DESIGN_CONFIG}
      brandKit={organization?.brandKit}
      locale={organization?.settings.defaultLanguage}
    />
  );
}
