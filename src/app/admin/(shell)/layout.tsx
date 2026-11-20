"use client";

import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      {(admin) => <AdminShell admin={admin}>{children}</AdminShell>}
    </AdminAuthGuard>
  );
}
