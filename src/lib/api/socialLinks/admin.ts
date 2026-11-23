import type { ApiSuccessResponse } from "@/lib/api/core/types";
import { adminApiFetch } from "@/lib/api/core/adminClient";
import { buildAdminListQuery, type AdminListPage, type AdminListParams } from "@/lib/api/core/adminList";
import type { SocialLinkInput, SocialLinkRecord } from "./types";

export async function fetchAdminSocialLinks(
  params: AdminListParams = {},
): Promise<ApiSuccessResponse<AdminListPage<SocialLinkRecord>>> {
  return adminApiFetch<ApiSuccessResponse<AdminListPage<SocialLinkRecord>>>(
    `/admin/social-links?${buildAdminListQuery(params)}`,
  );
}

export async function createAdminSocialLink(
  input: SocialLinkInput,
): Promise<ApiSuccessResponse<SocialLinkRecord>> {
  return adminApiFetch<ApiSuccessResponse<SocialLinkRecord>>("/admin/social-links", {
    method: "POST",
    body: input,
  });
}

export async function updateAdminSocialLink(
  id: number,
  input: Partial<SocialLinkInput>,
): Promise<ApiSuccessResponse<SocialLinkRecord>> {
  return adminApiFetch<ApiSuccessResponse<SocialLinkRecord>>(`/admin/social-links/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export async function deleteAdminSocialLink(id: number): Promise<ApiSuccessResponse<{ id: number }>> {
  return adminApiFetch<ApiSuccessResponse<{ id: number }>>(`/admin/social-links/${id}`, {
    method: "DELETE",
  });
}
