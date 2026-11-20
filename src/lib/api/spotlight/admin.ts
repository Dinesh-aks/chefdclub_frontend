import type { ApiSuccessResponse } from "@/lib/api/core/types";
import { adminApiFetch } from "@/lib/api/core/adminClient";
import { buildAdminListQuery, type AdminListPage, type AdminListParams } from "@/lib/api/core/adminList";
import type { SpotlightFormInput, SpotlightPlacement, SpotlightRecord } from "./types";

function toFormData(input: Partial<SpotlightFormInput>): FormData {
  const formData = new FormData();
  if (input.title !== undefined) formData.set("title", input.title);
  // Empty tag/badge are sent on purpose: the backend clears the field.
  if (input.tag !== undefined) formData.set("tag", input.tag);
  if (input.badge !== undefined) formData.set("badge", input.badge);
  if (input.placement !== undefined) formData.set("placement", input.placement);
  // An empty alt is sent on purpose: the backend clears it (the website then uses the title).
  if (input.alt !== undefined) formData.set("alt", input.alt);
  if (input.status !== undefined) formData.set("status", String(input.status));
  if (input.sort !== undefined) formData.set("sort", String(input.sort));
  if (input.image) formData.set("image", input.image);
  return formData;
}

export async function fetchAdminSpotlightList(
  params: AdminListParams & { status?: boolean; placement?: SpotlightPlacement } = {},
): Promise<ApiSuccessResponse<AdminListPage<SpotlightRecord>>> {
  return adminApiFetch<ApiSuccessResponse<AdminListPage<SpotlightRecord>>>(
    `/admin/spotlight?${buildAdminListQuery(params)}`,
  );
}

export async function fetchAdminSpotlight(id: number): Promise<ApiSuccessResponse<SpotlightRecord>> {
  return adminApiFetch<ApiSuccessResponse<SpotlightRecord>>(`/admin/spotlight/${id}`);
}

export async function createAdminSpotlight(
  input: SpotlightFormInput,
): Promise<ApiSuccessResponse<SpotlightRecord>> {
  return adminApiFetch<ApiSuccessResponse<SpotlightRecord>>("/admin/spotlight", {
    method: "POST",
    body: toFormData(input),
  });
}

export async function deleteAdminSpotlight(id: number): Promise<ApiSuccessResponse<{ id: number }>> {
  return adminApiFetch<ApiSuccessResponse<{ id: number }>>(`/admin/spotlight/${id}`, {
    method: "DELETE",
  });
}

export async function updateAdminSpotlight(
  id: number,
  input: Partial<SpotlightFormInput>,
): Promise<ApiSuccessResponse<SpotlightRecord>> {
  return adminApiFetch<ApiSuccessResponse<SpotlightRecord>>(`/admin/spotlight/${id}`, {
    method: "PATCH",
    body: toFormData(input),
  });
}
