"use client";

import * as React from "react";
import type { QueryConstraint } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

interface OrgScopedService<T> {
  subscribe: (
    organizationId: string,
    onChange: (items: T[]) => void,
    constraints?: QueryConstraint[]
  ) => () => void;
}

/**
 * Subscribes to a real-time, organization-scoped Firestore collection.
 * Every list-driven module (invoices, quotes, clients, products, expenses)
 * shares this single hook instead of re-implementing loading/error state.
 */
export function useOrgCollection<T>(
  service: OrgScopedService<T>,
  constraints: QueryConstraint[] = []
) {
  const { profile } = useAuth();
  const [items, setItems] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!profile?.organizationId) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = service.subscribe(profile.organizationId, (next) => {
      setItems(next);
      setLoading(false);
    }, constraints);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.organizationId, JSON.stringify(constraints.map(String))]);

  return { items, loading, organizationId: profile?.organizationId };
}
