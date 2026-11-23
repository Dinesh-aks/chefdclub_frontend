import type { SortingState } from "@tanstack/react-table";
import type { AdminReservationSort, ReservationRecord, ReservationStatus } from "@/lib/api/reservations";
import { formatBusinessDate, formatBusinessTime } from "@/lib/formatDateTime";

export const RESERVATION_STATUSES: ReservationStatus[] = [
  "Reviewing",
  "Accept",
  "Declined",
  "Rejection",
  "Completed",
];
export const ALL_STATUSES = "all";

export type ReservationFilters = {
  status: string;
  from: string;
  to: string;
  guest: string;
};

export const EMPTY_RESERVATION_FILTERS: ReservationFilters = {
  status: ALL_STATUSES,
  from: "",
  to: "",
  guest: "",
};

export const ADMIN_DATE_TRIGGER =
  "h-8 rounded-md border border-input bg-card px-2.5 py-0 text-[13px] shadow-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20";

export function formatReservationDate(value: string | null): string {
  return formatBusinessDate(value);
}

export function formatReservationTime(value: string | null): string {
  return formatBusinessTime(value);
}

export function formatReservationWhen(reservation: ReservationRecord): string {
  const date = formatReservationDate(reservation.date);
  const time = formatReservationTime(reservation.time);
  return time ? `${date}, ${time}` : date;
}

export function reservationSortingToApi(sorting: SortingState): {
  sort: AdminReservationSort;
  order: "asc" | "desc";
} {
  const column = sorting[0];
  if (!column) {
    return { sort: "addDate", order: "desc" };
  }
  const sortFields: AdminReservationSort[] = [
    "name",
    "email",
    "mobile",
    "guest",
    "date",
    "status",
    "addDate",
  ];
  const sort = sortFields.includes(column.id as AdminReservationSort)
    ? (column.id as AdminReservationSort)
    : "addDate";
  return { sort, order: column.desc ? "desc" : "asc" };
}

export function reservationFiltersActive(filters: ReservationFilters): boolean {
  return (
    filters.status !== ALL_STATUSES ||
    Boolean(filters.from) ||
    Boolean(filters.to) ||
    Boolean(filters.guest)
  );
}
