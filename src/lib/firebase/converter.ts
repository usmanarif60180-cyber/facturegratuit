import type { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

/**
 * Builds a typed Firestore converter for a domain model `T` whose `id` field
 * mirrors the document id. Keeps every service free of manual (de)serialization.
 */
export function makeConverter<T extends { id: string }>(): FirestoreDataConverter<T> {
  return {
    toFirestore(model: T) {
      const { id: _id, ...rest } = model;
      return rest;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): T {
      const data = snapshot.data(options);
      return { ...(data as Omit<T, "id">), id: snapshot.id } as T;
    },
  };
}
