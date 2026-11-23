"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import type { AdminDashboardData, AdminDashboardReservation } from "@/lib/api/core/adminAuth";
import type { ReservationStatus } from "@/lib/api/reservations";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DASHBOARD_PANEL_CLASS,
  DASHBOARD_PANEL_HEADER_CLASS,
  DASHBOARD_VIEW_ALL_CLASS,
  formatDashboardDate,
  formatDashboardTime,
} from "@/features/admin/dashboard/dashboardConstants";

function reservationWhen(reservation: AdminDashboardReservation): string {
  const date = formatDashboardDate(reservation.date);
  const time = formatDashboardTime(reservation.time);
  return time ? `${date}, ${time}` : date;
}

interface DashboardRecentPanelsProps {
  recentReservations: AdminDashboardData["recentReservations"];
  recentMessages: AdminDashboardData["recentMessages"];
}

export function DashboardRecentPanels({
  recentReservations,
  recentMessages,
}: DashboardRecentPanelsProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <section className={`${DASHBOARD_PANEL_CLASS} min-w-0 overflow-hidden`} aria-label="Recent reservations">
        <div className={DASHBOARD_PANEL_HEADER_CLASS}>
          <h2 className="font-semibold">Recent Reservations</h2>
          <Link href="/admin/reservations" className={DASHBOARD_VIEW_ALL_CLASS}>
            View all
            <ArrowRightIcon className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
        {recentReservations.length === 0 ? (
          <p className="px-3 py-4 text-muted-foreground">No reservations yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-muted/70 hover:bg-muted/70">
                <TableHead className="h-8 px-3 text-xs font-semibold">Guest</TableHead>
                <TableHead className="h-8 px-3 text-xs font-semibold">Date &amp; Time</TableHead>
                <TableHead className="h-8 px-3 text-xs font-semibold">Guests</TableHead>
                <TableHead className="h-8 px-3 text-xs font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReservations.map((reservation) => (
                <TableRow key={reservation.id} className="border-border">
                  <TableCell className="h-9 px-3 py-0 font-medium">{reservation.name}</TableCell>
                  <TableCell className="h-9 px-3 py-0 text-muted-foreground tabular-nums">
                    {reservationWhen(reservation)}
                  </TableCell>
                  <TableCell className="h-9 px-3 py-0 tabular-nums">{reservation.guest ?? "—"}</TableCell>
                  <TableCell className="h-9 px-3 py-0">
                    <StatusBadge status={reservation.status as ReservationStatus} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>

      <section className={`${DASHBOARD_PANEL_CLASS} min-w-0 self-start`} aria-label="Recent messages">
        <div className={DASHBOARD_PANEL_HEADER_CLASS}>
          <h2 className="font-semibold">Recent Messages</h2>
          <Link href="/admin/contact" className={DASHBOARD_VIEW_ALL_CLASS}>
            View all
            <ArrowRightIcon className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
        {recentMessages.length === 0 ? (
          <p className="px-3 py-4 text-muted-foreground">No messages yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {recentMessages.map((message) => (
              <li key={message.id} className="flex items-start justify-between gap-3 px-3 py-2">
                <div className="min-w-0">
                  <p className="font-medium">{message.name}</p>
                  <p className="truncate text-muted-foreground">{message.subject ?? message.message}</p>
                </div>
                <p className="shrink-0 text-xs text-muted-foreground">
                  {formatDashboardDate(message.addDate)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
