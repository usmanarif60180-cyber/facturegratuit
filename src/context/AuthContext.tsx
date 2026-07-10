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
import { createUserProfile, getUserProfile } from "@/lib/services/userService";
import { createOrganizationForNewUser } from "@/lib/services/organizationService";
import type { AppUser } from "@/types";

interface AuthContextValue {
  firebaseUser: User | null;
  profile: AppUser | null;
  loading: boolean;
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

  const value: AuthContextValue = {
    firebaseUser,
    profile,
    loading,
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
