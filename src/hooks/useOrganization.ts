"use client";

import * as React from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { useAuth } from "@/context/AuthContext";
import type { Organization } from "@/types";

export function useOrganization() {
  const { profile } = useAuth();
  const [organization, setOrganization] = React.useState<Organization | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!profile?.organizationId) {
      setOrganization(null);
      setLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(
      doc(db, COLLECTIONS.organizations, profile.organizationId),
      (snap) => {
        setOrganization(snap.exists() ? ({ id: snap.id, ...snap.data() } as Organization) : null);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [profile?.organizationId]);

  return { organization, loading };
}
