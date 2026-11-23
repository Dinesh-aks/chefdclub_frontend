import type { ApiSuccessResponse } from "@/lib/api/core/types";
import { adminApiFetch } from "@/lib/api/core/adminClient";
import { buildAdminListQuery, type AdminListPage, type AdminListParams } from "@/lib/api/core/adminList";
import type { MenuCardFormInput, MenuCardRecord, MenuCardType } from "./types";

function toFormData(input: Partial<MenuCardFormInput>): FormData {
  const formData = new FormData();
  if (input.menu !== undefined) formData.set("menu", String(input.menu));
  if (input.type !== undefined) formData.set("type", String(input.type));
  if (input.name !== undefined) formData.set("name", input.name);
  if (input.slug !== undefined) formData.set("slug", input.slug);
  if (input.status !== undefined) formData.set("status", String(input.status));
  if (input.sort !== undefined) formData.set("sort", String(input.sort));
  if (input.showOnHome !== undefined) formData.set("showOnHome", String(input.showOnHome));
  if (input.banner) formData.set("banner", input.banner);
  return formData;
}

export async function fetchAdminMenuCards(
  params: AdminListParams & { menu?: number; type?: MenuCardType; status?: boolean } = {},
): Promise<ApiSuccessResponse<AdminListPage<MenuCardRecord>>> {
  return adminApiFetch<ApiSuccessResponse<AdminListPage<MenuCardRecord>>>(
    `/admin/menu/cards?${buildAdminListQuery(params)}`,
  );
}

export async function fetchAdminMenuCard(id: number): Promise<ApiSuccessResponse<MenuCardRecord>> {
  return adminApiFetch<ApiSuccessResponse<MenuCardRecord>>(`/admin/menu/cards/${id}`);
}

export async function createAdminMenuCard(
  input: MenuCardFormInput,
): Promise<ApiSuccessResponse<MenuCardRecord>> {
  return adminApiFetch<ApiSuccessResponse<MenuCardRecord>>("/admin/menu/cards", {
    method: "POST",
    body: toFormData(input),
  });
}

export async function updateAdminMenuCard(
  id: number,
  input: Partial<MenuCardFormInput>,
): Promise<ApiSuccessResponse<MenuCardRecord>> {
  return adminApiFetch<ApiSuccessResponse<MenuCardRecord>>(`/admin/menu/cards/${id}`, {
    method: "PATCH",
    body: toFormData(input),
  });
}

export async function deleteAdminMenuCard(id: number): Promise<ApiSuccessResponse<{ id: number }>> {
  return adminApiFetch<ApiSuccessResponse<{ id: number }>>(`/admin/menu/cards/${id}`, {
    method: "DELETE",
  });
}
