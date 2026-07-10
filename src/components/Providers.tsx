"use client";

import * as React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SoundProvider } from "@/context/SoundContext";
import { ToastProvider } from "@/components/ui/Toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SoundProvider>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </SoundProvider>
    </ThemeProvider>
  );
}
