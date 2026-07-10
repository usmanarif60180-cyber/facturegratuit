/**
 * Pluggable interface for IVOXA's AI capabilities. Version 1 ships a stub
 * implementation so the UI, credit accounting and prompts are all wired up;
 * swapping in a real model provider later only means implementing this
 * interface differently — no call sites change.
 */

export type AICapability =
  | "invoice_draft"
  | "quote_draft"
  | "email_writer"
  | "reminder_writer"
  | "product_description"
  | "service_description"
  | "business_assistant"
  | "tax_assistant"
  | "contract_generator"
  | "proposal_generator";

export interface AIRequest {
  capability: AICapability;
  prompt: string;
  context?: Record<string, unknown>;
}

export interface AIResponse {
  content: string;
  capability: AICapability;
}

export interface AIAssistant {
  isAvailable(capability: AICapability): boolean;
  complete(request: AIRequest): Promise<AIResponse>;
}

const CAPABILITY_LABELS: Record<AICapability, string> = {
  invoice_draft: "AI Invoice Generator",
  quote_draft: "AI Quote Generator",
  email_writer: "AI Email Writer",
  reminder_writer: "AI Reminder Writer",
  product_description: "AI Product Description",
  service_description: "AI Service Description",
  business_assistant: "AI Business Assistant",
  tax_assistant: "AI Tax Assistant",
  contract_generator: "AI Contract Generator",
  proposal_generator: "AI Proposal Generator",
};

/** Stub assistant used until a real provider is connected via AI_PROVIDER_API_KEY. */
class PlaceholderAIAssistant implements AIAssistant {
  isAvailable(): boolean {
    return false;
  }

  async complete(request: AIRequest): Promise<AIResponse> {
    return {
      capability: request.capability,
      content: `${CAPABILITY_LABELS[request.capability]} is coming soon. This workspace is wired up and ready — connect an AI provider to enable it.`,
    };
  }
}

export const aiAssistant: AIAssistant = new PlaceholderAIAssistant();
export { CAPABILITY_LABELS };
