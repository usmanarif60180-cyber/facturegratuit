import type { Address, CurrencyCode, Timestamps } from "./common";

export const PIPELINE_STAGES = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export const PIPELINE_STAGE_LABELS: Record<PipelineStage, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
};

/** Rough win-probability per stage, used only for the Revenue Forecast
 * widget's estimate — not a real prediction model. */
export const PIPELINE_STAGE_PROBABILITY: Record<PipelineStage, number> = {
  new: 0.1,
  contacted: 0.2,
  qualified: 0.4,
  proposal: 0.6,
  negotiation: 0.8,
  won: 1,
  lost: 0,
};

export interface Lead extends Timestamps {
  id: string;
  organizationId: string;
  name: string;
  companyName?: string;
  email?: string;
  phone?: string;
  source?: string;
  stage: PipelineStage;
  estimatedValue?: number;
  currency?: CurrencyCode;
  tags?: string[];
  notes?: string;
  /** Set once a lead is converted into a paying Client. */
  convertedClientId?: string;
}

export interface Company extends Timestamps {
  id: string;
  organizationId: string;
  name: string;
  industry?: string;
  website?: string;
  address?: Address;
  size?: string;
  notes?: string;
}

export interface ContactPerson extends Timestamps {
  id: string;
  organizationId: string;
  /** A contact belongs to a Client (customer) and/or a Company. */
  clientId?: string;
  companyId?: string;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  isPrimary?: boolean;
  notes?: string;
}
