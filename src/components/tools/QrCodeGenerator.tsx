"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

export function QrCodeGenerator() {
  const [text, setText] = React.useState("https://ivoxa.com");
  const encoded = encodeURIComponent(text || " ");
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encoded}`;

  return (
    <Card>
      <CardContent className="grid gap-5 pt-6 sm:grid-cols-[1fr,auto] sm:items-start">
        <div>
          <Label htmlFor="qr-text">Link, text or payment note</Label>
          <Input
            id="qr-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://your-invoice-link.com or any text"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Generated via a public QR encoding service — nothing you type here is stored by IVOXA.
          </p>
          <a
            href={src}
            download="qr-code.png"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4 gap-2")}
          >
            <Download className="h-4 w-4" /> Download PNG
          </a>
        </div>
        <div className="flex justify-center rounded-lg border border-border bg-surface p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="Generated QR code" width={160} height={160} className="h-40 w-40" />
        </div>
      </CardContent>
    </Card>
  );
}
