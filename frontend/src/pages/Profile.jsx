import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import AdBanner from "../components/AdBanner";
import { User } from "lucide-react";
import { toast } from "../hooks/use-toast";

export default function Profile() {
  const [saved, setSaved] = useState(false);
  const save = (msg) => { setSaved(true); toast({ title: msg }); setTimeout(() => setSaved(false), 1500); };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">My Profile</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Account, security, billing address and future payment settings.</p>

      <div className="mt-6 flex items-center gap-4 p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-white flex items-center justify-center"><User className="h-7 w-7" /></div>
        <div className="flex-1">
          <div className="font-semibold text-neutral-900 dark:text-neutral-100">User</div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400">No email</div>
          <div className="text-xs text-neutral-500 mt-1">Connected account <span className="font-mono text-indigo-600">firebase</span></div>
        </div>
        <Button variant="outline" className="rounded-lg">Upload picture</Button>
      </div>

      <AdBanner />

      <div className="grid md:grid-cols-2 gap-5 mt-6">
        <form onSubmit={(e) => { e.preventDefault(); save("Profile saved"); }} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Account profile</h3>
          <div className="mt-5 grid gap-4">
            <div><Label>Display name</Label><Input className="mt-1.5" placeholder="Your name" /></div>
            <div><Label>Account email</Label><Input className="mt-1.5" type="email" placeholder="you@example.com" /></div>
            <div><Label>Phone</Label><Input className="mt-1.5" placeholder="+33 ..." /></div>
            <div><Label>Country</Label><Input className="mt-1.5" placeholder="France" /></div>
            <div><Label>Personal address</Label><Input className="mt-1.5" placeholder="Street, City" /></div>
          </div>
          <Button type="submit" className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Save profile</Button>
        </form>

        <form onSubmit={(e) => { e.preventDefault(); save("Billing saved"); }} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Billing profile</h3>
          <div className="mt-5 grid gap-4">
            <div><Label>Billing name</Label><Input className="mt-1.5" /></div>
            <div><Label>Billing email</Label><Input className="mt-1.5" type="email" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>City</Label><Input className="mt-1.5" /></div>
              <div><Label>Postal code</Label><Input className="mt-1.5" /></div>
            </div>
            <div><Label>Country</Label><Input className="mt-1.5" /></div>
            <div><Label>Tax / VAT number</Label><Input className="mt-1.5" /></div>
            <div><Label>Billing address</Label><Input className="mt-1.5" /></div>
          </div>
          <Button type="submit" className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Save billing profile</Button>
        </form>
      </div>
    </div>
  );
}
