import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { DEFAULT_ORGANIZATION_SETTINGS, type Organization } from "@/types/organization";
import { FREE_PLAN_DEFAULTS } from "@/types/subscription";

type NewCompanyInput = Partial<Omit<Organization, "id" | "ownerId" | "createdAt" | "updatedAt" | "settings">> & {
  name: string;
  settings?: Partial<Organization["settings"]>;
};

/** Every organization — the first one auto-provisioned at signup, and any
 * additional company created later from the workspace switcher — goes
 * through this one path, so a user can own any number of independent
 * companies with no special-cased "first org" id scheme. */
async function provisionOrganization(ownerId: string, input: NewCompanyInput): Promise<string> {
  const orgRef = await addDoc(collection(db, COLLECTIONS.organizations), {
    ownerId,
    ...input,
    settings: { ...DEFAULT_ORGANIZATION_SETTINGS, ...input.settings },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const subscriptionRef = doc(db, COLLECTIONS.organizations, orgRef.id, COLLECTIONS.subscriptions, "current");
  await setDoc(subscriptionRef, {
    organizationId: orgRef.id,
    ...FREE_PLAN_DEFAULTS,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return orgRef.id;
}

/** Creates the organization + its Free-plan subscription for a brand-new account. */
export async function createOrganizationForNewUser(ownerId: string, name: string): Promise<string> {
  return provisionOrganization(ownerId, { name });
}

/** Creates an additional, fully independent company owned by the same
 * account — used by the "Create new company" wizard. */
export async function createCompany(ownerId: string, input: NewCompanyInput): Promise<string> {
  return provisionOrganization(ownerId, input);
}

export async function getOrganization(organizationId: string): Promise<Organization | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.organizations, organizationId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Organization) : null;
}

export async function updateOrganization(organizationId: string, data: Partial<Organization>) {
  await updateDoc(doc(db, COLLECTIONS.organizations, organizationId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/** Firestore returns createdAt/updatedAt as Timestamp objects at runtime
 * (the Timestamps type declares `string` for the resolved-value contract
 * used once data leaves Firestore) — this tolerates either shape safely. */
function toMillis(value: unknown): number {
  if (value && typeof value === "object" && "toMillis" in value) {
    return (value as { toMillis: () => number }).toMillis();
  }
  if (typeof value === "string") return new Date(value).getTime();
  return 0;
}

function sortByCreatedAt(orgs: Organization[]): Organization[] {
  return [...orgs].sort((a, b) => toMillis(a.createdAt) - toMillis(b.createdAt));
}

/** All companies this account owns — powers the workspace switcher. Sorted
 * client-side by creation date to avoid requiring a composite Firestore
 * index for a query this small (a personal account's company count). */
export async function getOrganizationsByOwner(ownerId: string): Promise<Organization[]> {
  const snap = await getDocs(query(collection(db, COLLECTIONS.organizations), where("ownerId", "==", ownerId)));
  return sortByCreatedAt(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Organization));
}

export function subscribeOrganizationsByOwner(ownerId: string, onChange: (orgs: Organization[]) => void): Unsubscribe {
  return onSnapshot(query(collection(db, COLLECTIONS.organizations), where("ownerId", "==", ownerId)), (snap) => {
    onChange(sortByCreatedAt(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Organization)));
  });
}
