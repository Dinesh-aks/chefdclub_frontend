import { apiFetch } from "@/lib/api/core/client";
import type { ApiSuccessResponse } from "@/lib/api/core/types";
import type { CreateContactPayload } from "./types";

export async function submitContactMessage(
  payload: CreateContactPayload,
): Promise<ApiSuccessResponse<{ id: number }>> {
  return apiFetch<ApiSuccessResponse<{ id: number }>>("/contact", {
    method: "POST",
    body: payload,
  });
}
