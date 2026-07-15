import { createOrgScopedService } from "@/lib/firebase/firestoreService";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { Company } from "@/types";

export const companyService = createOrgScopedService<Company>(COLLECTIONS.companies);
