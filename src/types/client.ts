import type { Address, Timestamps } from "./common";

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
}
