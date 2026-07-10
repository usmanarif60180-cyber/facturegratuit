"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { submitContactMessage } from "@/lib/services/contactService";

export default function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = React.useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContactMessage(form);
      toast({ variant: "success", title: "Message sent", description: "We'll get back to you soon." });
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast({ variant: "error", title: "Something went wrong", description: "Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container max-w-xl py-20">
      <h1 className="text-4xl font-bold tracking-tight">Get in touch</h1>
      <p className="mt-3 text-muted-foreground">
        Questions, feedback, or partnership ideas — we&apos;d love to hear from you.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Send a message</CardTitle>
          <CardDescription>We typically reply within one business day.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              />
            </div>
            <Button type="submit" className="w-full" loading={loading}>
              Send message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
