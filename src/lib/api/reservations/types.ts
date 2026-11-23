import type { AdminListPage } from "@/lib/api/core/adminList";

export interface CreateReservationPayload {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  time: string;
  format: string;
  guestCount: number;
  menu: string;
  winePairing: string;
  occasion?: string;
  turnstileToken?: string;
}

/** Matches the distinct values present in the legacy `reservation.status` column —
 * "Declined" and "Rejection" both occur in real data. */
export type ReservationStatus = "Reviewing" | "Accept" | "Declined" | "Rejection" | "Completed";

export interface ReservationRecord {
  id: number;
  name: string;
  email: string;
  mobile: string | null;
  guest: number | null;
  request: string | null;
  restrictions: string | null;
  adminComments: string | null;
  date: string | null;
  time: string | null;
  status: ReservationStatus;
  addDate: string;
}

export type AdminReservationSort =
  | "name"
  | "email"
  | "mobile"
  | "guest"
  | "date"
  | "status"
  | "addDate";

export interface AdminReservationListParams {
  page?: number;
  limit?: number;
  offset?: number;
  search?: string;
  status?: ReservationStatus | "all";
  dateFrom?: string;
  dateTo?: string;
  guest?: number;
  sort?: AdminReservationSort;
  order?: "asc" | "desc";
}

export type AdminReservationPage = AdminListPage<ReservationRecord>;
