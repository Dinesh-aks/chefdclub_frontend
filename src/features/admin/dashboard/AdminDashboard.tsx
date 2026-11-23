"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/core/client";
import { fetchAdminDashboard, type AdminDashboardData } from "@/lib/api/core/adminAuth";
import { InkDots } from "@/components/shared/InkDots";
import { DashboardQuickActions } from "@/features/admin/dashboard/components/DashboardQuickActions";
import { DashboardRecentPanels } from "@/features/admin/dashboard/components/DashboardRecentPanels";
import { DashboardStatCards } from "@/features/admin/dashboard/components/DashboardStatCards";

export function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetchAdminDashboard();
        if (!cancelled) {
          setData(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Could not load dashboard.");
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (!data) {
    return <InkDots label="Loading dashboard" />;
  }

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">{data.greeting}</p>
      </div>

      <DashboardStatCards stats={data.stats} />

      <DashboardRecentPanels
        recentReservations={data.recentReservations}
        recentMessages={data.recentMessages}
      />

      <DashboardQuickActions />
    </div>
  );
}
