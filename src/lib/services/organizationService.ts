import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { DEFAULT_ORGANIZATION_SETTINGS, type Organization } from "@/types/organization";
import { FREE_PLAN_DEFAULTS } from "@/types/subscription";

/** Creates the organization + its Free-plan subscription for a brand-new account. */
export async function createOrganizationForNewUser(ownerId: string, name: string): Promise<string> {
  const orgRef = doc(db, COLLECTIONS.organizations, ownerId); // 1:1 org id == first owner's uid for V1 simplicity
  await setDoc(orgRef, {
    ownerId,
    name,
    settings: DEFAULT_ORGANIZATION_SETTINGS,
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
