import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import AdBanner from "../components/AdBanner";
import { Mail, Globe, MessageSquare } from "lucide-react";
import { toast } from "../hooks/use-toast";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const submit = (e) => { e.preventDefault(); toast({ title: "Message sent", description: "We'll get back to you shortly." }); setForm({ name: "", email: "", subject: "", message: "" }); };

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <div className="text-sm text-neutral-500 mb-1">Contact</div>
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Contact ProFacture AI</h1>
      <p className="mt-3 text-neutral-500 dark:text-neutral-400 max-w-2xl">Questions, support, legal requests, privacy requests and business enquiries can be sent directly to the official contact address below.</p>

      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Contact information</h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center"><Mail className="h-4 w-4" /></div>
              <div>
                <div className="text-neutral-500">Email</div>
                <a href="mailto:contact@facturergratuit.com" className="font-medium text-indigo-600 hover:underline">contact@facturergratuit.com</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center"><Globe className="h-4 w-4" /></div>
              <div>
                <div className="text-neutral-500">Website</div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">facturergratuit.com</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center"><MessageSquare className="h-4 w-4" /></div>
              <div>
                <div className="text-neutral-500">Response</div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">Support replies as soon as possible</div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Send a message</h3>
          <div className="grid gap-4">
            <div><Label>Name</Label><Input required className="mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Email</Label><Input required type="email" className="mt-1.5" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><Label>Subject</Label><Input required className="mt-1.5" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
            <div><Label>Message</Label><Textarea required className="mt-1.5 min-h-[110px]" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
          </div>
          <Button type="submit" className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Send email</Button>
        </form>
      </div>

      <AdBanner />
    </div>
  );
}
