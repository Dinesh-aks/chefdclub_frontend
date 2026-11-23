import { adminApiFetch } from "@/lib/api/core/adminClient";
import type { ApiSuccessResponse } from "@/lib/api/core/types";
import { buildAdminListQuery, type AdminListParams } from "@/lib/api/core/adminList";
import type { ContactMessagePage, ContactMessageRecord } from "./types";

/** Admin: one contact message in full, including subject and message body. */
export async function fetchAdminContactMessage(
  id: number,
): Promise<ApiSuccessResponse<ContactMessageRecord>> {
  return adminApiFetch<ApiSuccessResponse<ContactMessageRecord>>(`/admin/contact/${id}`);
}

/** Server-paginated contact inbox (~3,800 rows). */
export async function fetchAdminContactMessages(
  params: AdminListParams = {},
): Promise<ApiSuccessResponse<ContactMessagePage>> {
  return adminApiFetch<ApiSuccessResponse<ContactMessagePage>>(
    `/admin/contact?${buildAdminListQuery(params)}`,
  );
}
