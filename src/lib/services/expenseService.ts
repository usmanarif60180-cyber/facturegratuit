import { createOrgScopedService } from "@/lib/firebase/firestoreService";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { Expense } from "@/types";

export const expenseService = createOrgScopedService<Expense>(COLLECTIONS.expenses);
