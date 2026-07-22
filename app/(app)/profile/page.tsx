"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Avatar } from "@/components/ui/Avatar";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/lib/services/userService";
import { LANGUAGES } from "@/lib/constants/languages";
import Link from "next/link";

export default function ProfilePage() {
  const { profile, firebaseUser, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = React.useState("");
  const [languagePreference, setLanguagePreference] = React.useState("en");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setLanguagePreference(profile.languagePreference);
    }
  }, [profile]);

  async function handleSave() {
    if (!firebaseUser) return;
    setSaving(true);
    try {
      await updateUserProfile(firebaseUser.uid, { displayName, languagePreference });
      await refreshProfile();
      toast({ variant: "success", title: "Profile updated" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="Profile" description="Manage your personal account details." />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
          <CardDescription>This information is not shared with your clients.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar src={firebaseUser?.photoURL} name={displayName || "User"} size={56} />
            <div>
              <p className="font-medium">{firebaseUser?.email}</p>
              <p className="text-sm text-muted-foreground">
                {firebaseUser?.emailVerified ? "Email verified" : "Email not verified"}
                {!firebaseUser?.emailVerified && (
                  <>
                    {" "}
                    ·{" "}
                    <Link href="/verify-email" className="text-primary hover:underline">
                      Verify now
                    </Link>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="displayName">Full name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="language">Preferred language</Label>
              <Select
                id="language"
                value={languagePreference}
                onChange={(e) => setLanguagePreference(e.target.value)}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.tag} value={l.tag}>
                    {l.label} ({l.nativeLabel})
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button loading={saving} onClick={handleSave}>
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
