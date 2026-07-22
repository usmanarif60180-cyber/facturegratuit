import { DesignableDocument } from "@/components/design/DesignableDocument";
import { quoteToDesignableDoc } from "@/lib/design/documentAdapter";
import { resolveDesignConfig } from "@/lib/design/resolve";
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
      design={resolveDesignConfig(organization, "quote")}
      brandKit={organization?.brandKit}
      locale={organization?.settings.defaultLanguage}
    />
  );
}
