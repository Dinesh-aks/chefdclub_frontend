import type { ApiSuccessResponse } from "@/lib/api/core/types";
import { adminApiFetch } from "@/lib/api/core/adminClient";
import { buildAdminListQuery } from "@/lib/api/core/adminList";
import type {
  AdminReservationListParams,
  AdminReservationPage,
  ReservationRecord,
  ReservationStatus,
} from "./types";

export async function fetchAdminReservations(
  params: AdminReservationListParams = {},
): Promise<ApiSuccessResponse<AdminReservationPage>> {
  return adminApiFetch<ApiSuccessResponse<AdminReservationPage>>(
    `/admin/reservations?${buildAdminListQuery(params)}`,
  );
}

export async function updateAdminReservationStatus(
  id: number,
  status: ReservationStatus,
): Promise<ApiSuccessResponse<ReservationRecord>> {
  return adminApiFetch<ApiSuccessResponse<ReservationRecord>>(`/admin/reservations/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export async function updateAdminReservationComments(
  id: number,
  adminComments: string | null,
): Promise<ApiSuccessResponse<ReservationRecord>> {
  return adminApiFetch<ApiSuccessResponse<ReservationRecord>>(`/admin/reservations/${id}/comments`, {
    method: "PATCH",
    body: { adminComments },
  });
}
