import type { DesignConfig, Organization } from "@/types";
import { DEFAULT_DESIGN_CONFIG } from "./defaults";
import { getTemplate } from "./templates";

/** Resolves which DesignConfig a document should render with: an explicit
 * Design Studio override always wins, then the company's default template
 * for that document kind, then the global default. */
export function resolveDesignConfig(organization: Organization | null, kind: "invoice" | "quote"): DesignConfig {
  if (organization?.designConfig) return organization.designConfig;
  const templateId = kind === "invoice" ? organization?.defaultInvoiceTemplateId : organization?.defaultQuoteTemplateId;
  const template = templateId ? getTemplate(templateId) : undefined;
  return template?.design ?? DEFAULT_DESIGN_CONFIG;
}
