"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { fetchAdminMe, type AdminProfile } from "@/lib/api/core/adminAuth";

type AdminAuthGuardProps = {
  children: (admin: AdminProfile) => ReactNode;
};

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      try {
        const response = await fetchAdminMe();
        if (!cancelled) {
          setAdmin(response.data);
          setChecking(false);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }
        router.replace("/admin/login");
      }
    }

    void verify();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (checking || !admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 text-sm text-muted-foreground">
        Loading admin…
      </div>
    );
  }

  return <>{children(admin)}</>;
}
