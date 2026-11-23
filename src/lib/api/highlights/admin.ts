import type { ApiSuccessResponse } from "@/lib/api/core/types";
import { adminApiFetch } from "@/lib/api/core/adminClient";
import { buildAdminListQuery, type AdminListPage, type AdminListParams } from "@/lib/api/core/adminList";
import type { HighlightFormInput, HighlightRecord } from "./types";

function toFormData(input: Partial<HighlightFormInput>): FormData {
  const formData = new FormData();
  if (input.name !== undefined) formData.set("name", input.name);
  if (input.description !== undefined) formData.set("description", input.description);
  if (input.status !== undefined) formData.set("status", String(input.status));
  if (input.sort !== undefined) formData.set("sort", String(input.sort));
  if (input.image) formData.set("image", input.image);
  return formData;
}

export async function fetchAdminHighlights(
  params: AdminListParams & { status?: boolean } = {},
): Promise<ApiSuccessResponse<AdminListPage<HighlightRecord>>> {
  return adminApiFetch<ApiSuccessResponse<AdminListPage<HighlightRecord>>>(
    `/admin/highlights?${buildAdminListQuery(params)}`,
  );
}

export async function fetchAdminHighlight(id: number): Promise<ApiSuccessResponse<HighlightRecord>> {
  return adminApiFetch<ApiSuccessResponse<HighlightRecord>>(`/admin/highlights/${id}`);
}

export async function createAdminHighlight(
  input: HighlightFormInput,
): Promise<ApiSuccessResponse<HighlightRecord>> {
  return adminApiFetch<ApiSuccessResponse<HighlightRecord>>("/admin/highlights", {
    method: "POST",
    body: toFormData(input),
  });
}

export async function updateAdminHighlight(
  id: number,
  input: Partial<HighlightFormInput>,
): Promise<ApiSuccessResponse<HighlightRecord>> {
  return adminApiFetch<ApiSuccessResponse<HighlightRecord>>(`/admin/highlights/${id}`, {
    method: "PATCH",
    body: toFormData(input),
  });
}

export async function deleteAdminHighlight(id: number): Promise<ApiSuccessResponse<{ id: number }>> {
  return adminApiFetch<ApiSuccessResponse<{ id: number }>>(`/admin/highlights/${id}`, {
    method: "DELETE",
  });
}
