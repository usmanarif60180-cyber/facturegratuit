import { updateOrganization } from "@/lib/services/organizationService";
import type { BrandKit, DesignConfig } from "@/types/design";

export async function setActiveDesign(organizationId: string, design: DesignConfig) {
  await updateOrganization(organizationId, { designConfig: { ...design, updatedAt: new Date().toISOString() } });
}

export async function updateBrandKit(organizationId: string, brandKit: BrandKit) {
  await updateOrganization(organizationId, { brandKit });
}
