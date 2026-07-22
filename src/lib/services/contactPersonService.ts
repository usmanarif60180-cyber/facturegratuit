import { createOrgScopedService } from "@/lib/firebase/firestoreService";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { ContactPerson } from "@/types";

export const contactPersonService = createOrgScopedService<ContactPerson>(COLLECTIONS.contactPersons);
