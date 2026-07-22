import type { Address, Timestamps } from "./common";

/** CRM lifecycle stage for a customer — separate from Lead's pipeline
 * stage, which tracks a not-yet-won prospect (see src/types/crm.ts). */
export type CustomerStatus = "active" | "prospect" | "churned";

export interface Client extends Timestamps {
  id: string;
  organizationId: string;
  displayName: string;
  companyName?: string;
  email?: string;
  phone?: string;
  address?: Address;
  vatNumber?: string;
  companyNumber?: string;
  notes?: string;
  archived?: boolean;
  companyId?: string;
  status?: CustomerStatus;
  tags?: string[];
  source?: string;
}
