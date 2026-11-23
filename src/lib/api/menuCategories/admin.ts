import type { ApiSuccessResponse } from "@/lib/api/core/types";
import { adminApiFetch } from "@/lib/api/core/adminClient";
import { buildAdminListQuery, type AdminListPage, type AdminListParams } from "@/lib/api/core/adminList";
import type {
  AdminMenuCategoryListParams,
  MenuCategoryFormInput,
  MenuCategoryRecord,
} from "./types";

function toFormData(input: Partial<MenuCategoryFormInput>): FormData {
  const formData = new FormData();
  if (input.name !== undefined) formData.set("name", input.name);
  if (input.slug !== undefined) formData.set("slug", input.slug);
  if (input.description !== undefined) formData.set("description", input.description);
  if (input.status !== undefined) formData.set("status", String(input.status));
  if (input.sort !== undefined) formData.set("sort", String(input.sort));
  if (input.image) formData.set("image", input.image);
  if (input.banner) formData.set("banner", input.banner);
  return formData;
}

export async function fetchAdminMenuCategories(
  params: AdminMenuCategoryListParams = {},
): Promise<ApiSuccessResponse<AdminListPage<MenuCategoryRecord>>> {
  return adminApiFetch<ApiSuccessResponse<AdminListPage<MenuCategoryRecord>>>(
    `/admin/menu/categories?${buildAdminListQuery(params)}`,
  );
}

export async function fetchAdminMenuCategory(
  id: number,
): Promise<ApiSuccessResponse<MenuCategoryRecord>> {
  return adminApiFetch<ApiSuccessResponse<MenuCategoryRecord>>(`/admin/menu/categories/${id}`);
}

export async function createAdminMenuCategory(
  input: MenuCategoryFormInput,
): Promise<ApiSuccessResponse<MenuCategoryRecord>> {
  return adminApiFetch<ApiSuccessResponse<MenuCategoryRecord>>("/admin/menu/categories", {
    method: "POST",
    body: toFormData(input),
  });
}

export async function updateAdminMenuCategory(
  id: number,
  input: Partial<MenuCategoryFormInput>,
): Promise<ApiSuccessResponse<MenuCategoryRecord>> {
  return adminApiFetch<ApiSuccessResponse<MenuCategoryRecord>>(`/admin/menu/categories/${id}`, {
    method: "PATCH",
    body: toFormData(input),
  });
}

export async function deleteAdminMenuCategory(
  id: number,
): Promise<ApiSuccessResponse<{ id: number }>> {
  return adminApiFetch<ApiSuccessResponse<{ id: number }>>(`/admin/menu/categories/${id}`, {
    method: "DELETE",
  });
}
