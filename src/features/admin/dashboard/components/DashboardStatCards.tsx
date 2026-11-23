"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import type { AdminDashboardData } from "@/lib/api/core/adminAuth";
import {
  DASHBOARD_PANEL_CLASS,
  DASHBOARD_STAT_CARDS,
} from "@/features/admin/dashboard/dashboardConstants";

interface DashboardStatCardsProps {
  stats: AdminDashboardData["stats"];
}

export function DashboardStatCards({ stats }: DashboardStatCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {DASHBOARD_STAT_CARDS.map((stat) => {
        const Icon = stat.icon;
        return (
          <Link
            key={stat.key}
            href={stat.href}
            className={`${DASHBOARD_PANEL_CLASS} group flex flex-col gap-0.5 p-3 transition-colors hover:border-input hover:bg-muted/40`}
          >
            <span className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Icon className="size-3.5" aria-hidden="true" />
                {stat.label}
              </span>
              <ArrowRightIcon
                className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </span>
            <span className="text-2xl font-semibold tracking-tight tabular-nums">{stats[stat.key]}</span>
            <span className="text-xs text-muted-foreground">{stat.caption}</span>
          </Link>
        );
      })}
    </div>
  );
}
