import type { Timestamps, LanguageTag } from "./common";

export type UserRole = "owner" | "admin" | "member" | "viewer";
export type ThemePreference = "light" | "dark" | "system";

export interface AppUser extends Timestamps {
  id: string; // Firebase Auth uid
  email: string;
  displayName: string;
  photoURL?: string | null;
  emailVerified: boolean;
  organizationId: string;
  role: UserRole;
  languagePreference: LanguageTag;
  themePreference: ThemePreference;
  lastLoginAt?: string;
}
