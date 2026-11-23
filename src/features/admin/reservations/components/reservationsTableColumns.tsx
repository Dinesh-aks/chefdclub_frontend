"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type ReservationRecord, type ReservationStatus } from "@/lib/api/reservations";
import { Button } from "@/components/ui/button";
import { ReservationStatusSelector } from "@/features/admin/reservations/components/ReservationStatusSelector";
import { formatReservationWhen } from "@/features/admin/reservations/reservationsUtils";

export function createReservationsTableColumns({
  updatingId,
  onViewDetails,
  onStatusChange,
}: {
  updatingId: number | null;
  onViewDetails: (reservation: ReservationRecord) => void;
  onStatusChange: (reservation: ReservationRecord, status: ReservationStatus) => void;
}): ColumnDef<ReservationRecord>[] {
  return [
    {
      accessorKey: "name",
      header: "Guest",
      cell: (info) => <span className="font-medium">{info.row.original.name}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => (
        <span className="block max-w-[220px] truncate text-muted-foreground">
          {info.row.original.email}
        </span>
      ),
    },
    {
      accessorKey: "mobile",
      header: "Mobile",
      cell: (info) => (
        <span className="tabular-nums">{info.row.original.mobile?.trim() || "—"}</span>
      ),
    },
    {
      id: "guest",
      accessorFn: (row) => row.guest ?? 0,
      header: "Guests",
    },
    {
      id: "date",
      accessorFn: (row) => (row.date ? new Date(row.date).getTime() : 0),
      header: "Date & Time",
      cell: (info) => <span className="tabular-nums">{formatReservationWhen(info.row.original)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const reservation = info.row.original;
        return (
          <ReservationStatusSelector
            reservation={reservation}
            disabled={updatingId === reservation.id}
            onStatusChange={onStatusChange}
          />
        );
      },
    },
    {
      id: "details",
      header: "Details",
      enableSorting: false,
      enableGlobalFilter: false,
      cell: (info) => (
        <Button variant="outline" size="sm" onClick={() => onViewDetails(info.row.original)}>
          View more
        </Button>
      ),
    },
  ];
}
