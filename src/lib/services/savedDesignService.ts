import { createOrgScopedService, orderBy } from "@/lib/firebase/firestoreService";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { SavedDesign } from "@/types";

export const savedDesignService = createOrgScopedService<SavedDesign>(COLLECTIONS.savedDesigns);
export { orderBy };
