"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

/** Theme + shadcn Sonner for admin routes (toasts inherit `.admin-theme` on body). */
export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      enableColorScheme={false}
    >
      {children}
      <Toaster position="top-center" richColors closeButton />
    </ThemeProvider>
  );
}
