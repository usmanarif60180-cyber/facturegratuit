import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type QueryConstraint,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./config";
import { makeConverter } from "./converter";
import { orgScoped } from "./collections";

/**
 * Generic, typed CRUD factory over an organization-scoped Firestore
 * subcollection. Every domain service (invoices, quotes, clients, ...)
 * is a thin wrapper around this so business logic never repeats
 * Firestore plumbing.
 */
export function createOrgScopedService<T extends { id: string; organizationId: string }>(
  collectionName: string
) {
  const converter = makeConverter<T>();

  function ref(organizationId: string) {
    return collection(db, orgScoped(collectionName, organizationId)).withConverter(converter);
  }

  async function list(organizationId: string, constraints: QueryConstraint[] = []): Promise<T[]> {
    const snap = await getDocs(query(ref(organizationId), ...constraints));
    return snap.docs.map((d) => d.data());
  }

  async function get(organizationId: string, id: string): Promise<T | null> {
    const snap = await getDoc(doc(ref(organizationId), id));
    return snap.exists() ? snap.data() : null;
  }

  async function create(
    organizationId: string,
    data: Omit<T, "id" | "organizationId" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const payload = {
      ...data,
      organizationId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, orgScoped(collectionName, organizationId)), payload);
    return docRef.id;
  }

  async function update(organizationId: string, id: string, data: Partial<Omit<T, "id" | "organizationId">>) {
    await updateDoc(doc(collection(db, orgScoped(collectionName, organizationId)), id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  async function remove(organizationId: string, id: string) {
    await deleteDoc(doc(ref(organizationId), id));
  }

  function subscribe(
    organizationId: string,
    onChange: (items: T[]) => void,
    constraints: QueryConstraint[] = []
  ): Unsubscribe {
    return onSnapshot(query(ref(organizationId), ...constraints), (snap) => {
      onChange(snap.docs.map((d) => d.data()));
    });
  }

  return { ref, list, get, create, update, remove, subscribe };
}

export { where, orderBy };
