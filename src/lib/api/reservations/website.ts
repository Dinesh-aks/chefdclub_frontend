import { apiFetch } from "@/lib/api/core/client";
import type { ApiSuccessResponse } from "@/lib/api/core/types";
import type { CreateReservationPayload } from "./types";

export async function submitReservationRequest(
  payload: CreateReservationPayload,
): Promise<ApiSuccessResponse<{ id: number }>> {
  return apiFetch<ApiSuccessResponse<{ id: number }>>("/reservations", {
    method: "POST",
    body: payload,
  });
}
