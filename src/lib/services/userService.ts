import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { AppUser } from "@/types";

export async function getUserProfile(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.users, uid));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as AppUser) : null;
}

export async function createUserProfile(
  uid: string,
  data: Pick<AppUser, "email" | "displayName" | "organizationId"> & Partial<AppUser>
) {
  const ref = doc(db, COLLECTIONS.users, uid);
  await setDoc(ref, {
    email: data.email,
    displayName: data.displayName,
    photoURL: data.photoURL ?? null,
    emailVerified: data.emailVerified ?? false,
    organizationId: data.organizationId,
    role: data.role ?? "owner",
    languagePreference: data.languagePreference ?? "en",
    themePreference: data.themePreference ?? "system",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserProfile(
  uid: string,
  data: Partial<
    Pick<AppUser, "displayName" | "languagePreference" | "themePreference" | "onboardingCompletedAt">
  >
) {
  await updateDoc(doc(db, COLLECTIONS.users, uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
