"use client";

import * as React from "react";
import type { User } from "firebase/auth";
import {
  observeAuthState,
  signInWithEmail,
  signInWithGoogle,
  signOut as firebaseSignOut,
  signUpWithEmail,
  sendPasswordReset,
  resendVerificationEmail,
} from "@/lib/firebase/auth";
import { createUserProfile, getUserProfile, switchActiveOrganization } from "@/lib/services/userService";
import { createOrganizationForNewUser, subscribeOrganizationsByOwner } from "@/lib/services/organizationService";
import type { AppUser, Organization } from "@/types";

interface AuthContextValue {
  firebaseUser: User | null;
  profile: AppUser | null;
  loading: boolean;
  /** Every company this account owns — powers the workspace switcher. */
  organizations: Organization[];
  organizationsLoading: boolean;
  switchingOrganization: boolean;
  switchOrganization: (organizationId: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  continueWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = React.useState<User | null>(null);
  const [profile, setProfile] = React.useState<AppUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [organizations, setOrganizations] = React.useState<Organization[]>([]);
  const [organizationsLoading, setOrganizationsLoading] = React.useState(true);
  const [switchingOrganization, setSwitchingOrganization] = React.useState(false);

  const loadProfile = React.useCallback(async (user: User) => {
    const existing = await getUserProfile(user.uid);
    if (existing) {
      setProfile(existing);
      return;
    }
    // First sign-in: provision an organization + profile so every user
    // lands in a fully-formed workspace, no separate onboarding step.
    const organizationId = await createOrganizationForNewUser(
      user.uid,
      user.displayName ?? "My Business"
    );
    await createUserProfile(user.uid, {
      email: user.email ?? "",
      displayName: user.displayName ?? "",
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      organizationId,
      role: "owner",
    });
    setProfile(await getUserProfile(user.uid));
  }, []);

  React.useEffect(() => {
    const unsubscribe = observeAuthState(async (user) => {
      setFirebaseUser(user);
      if (user) {
        await loadProfile(user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [loadProfile]);

  React.useEffect(() => {
    if (!firebaseUser) {
      setOrganizations([]);
      setOrganizationsLoading(false);
      return;
    }
    setOrganizationsLoading(true);
    const unsubscribe = subscribeOrganizationsByOwner(firebaseUser.uid, (orgs) => {
      setOrganizations(orgs);
      setOrganizationsLoading(false);
    });
    return unsubscribe;
  }, [firebaseUser]);

  const value: AuthContextValue = {
    firebaseUser,
    profile,
    loading,
    organizations,
    organizationsLoading,
    switchingOrganization,
    switchOrganization: async (organizationId) => {
      if (!firebaseUser || organizationId === profile?.organizationId) return;
      setSwitchingOrganization(true);
      try {
        await switchActiveOrganization(firebaseUser.uid, organizationId);
        await loadProfile(firebaseUser);
      } finally {
        setSwitchingOrganization(false);
      }
    },
    signIn: async (email, password) => {
      await signInWithEmail(email, password);
    },
    signUp: async (name, email, password) => {
      await signUpWithEmail(name, email, password);
    },
    continueWithGoogle: async () => {
      await signInWithGoogle();
    },
    signOut: async () => {
      await firebaseSignOut();
    },
    resetPassword: async (email) => {
      await sendPasswordReset(email);
    },
    resendVerification: async () => {
      await resendVerificationEmail();
    },
    refreshProfile: async () => {
      if (firebaseUser) await loadProfile(firebaseUser);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
