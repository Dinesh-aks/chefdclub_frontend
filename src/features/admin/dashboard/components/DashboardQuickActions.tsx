"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import {
  DASHBOARD_PANEL_CLASS,
  DASHBOARD_PANEL_HEADER_CLASS,
  DASHBOARD_QUICK_ACTIONS,
} from "@/features/admin/dashboard/dashboardConstants";

export function DashboardQuickActions() {
  return (
    <section className={DASHBOARD_PANEL_CLASS} aria-label="Quick actions">
      <div className={DASHBOARD_PANEL_HEADER_CLASS}>
        <h2 className="font-semibold">Quick Actions</h2>
      </div>
      <div className="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-4">
        {DASHBOARD_QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2 font-medium transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
            >
              <span className="flex items-center gap-2">
                <Icon className="size-4" aria-hidden="true" />
                {action.label}
              </span>
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
