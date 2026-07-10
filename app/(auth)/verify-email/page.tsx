"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MailCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { firebaseUser, resendVerification, signOut, loading } = useAuth();
  const { toast } = useToast();
  const [sending, setSending] = React.useState(false);

  React.useEffect(() => {
    if (!loading && !firebaseUser) router.replace("/login");
  }, [loading, firebaseUser, router]);

  async function handleResend() {
    setSending(true);
    try {
      await resendVerification();
      toast({ variant: "success", title: "Verification email sent" });
    } finally {
      setSending(false);
    }
  }

  return (
    <Card className="animate-slide-up text-center">
      <CardHeader className="items-center">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="h-6 w-6" aria-hidden="true" />
        </div>
        <CardTitle className="text-xl">Verify your email</CardTitle>
        <CardDescription>
          We sent a verification link to <strong>{firebaseUser?.email}</strong>. Click it to activate
          your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full" onClick={handleResend} loading={sending}>
          Resend email
        </Button>
        <Button variant="ghost" className="w-full" onClick={() => signOut().then(() => router.push("/login"))}>
          Sign out
        </Button>
      </CardContent>
    </Card>
  );
}
