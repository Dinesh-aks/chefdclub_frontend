import type { ApiSuccessResponse } from "@/lib/api/core/types";
import { adminApiFetch } from "@/lib/api/core/adminClient";
import { buildAdminListQuery, type AdminListPage, type AdminListParams } from "@/lib/api/core/adminList";
import type { FaqCategory, FaqInput, FaqListItem, FaqRecord } from "./types";

/** Admin: paginated FAQs (search, sort, page/limit, optional category/status filters). */
export async function fetchAdminFaqs(
  params: AdminListParams & { category?: FaqCategory; status?: boolean } = {},
): Promise<ApiSuccessResponse<AdminListPage<FaqListItem>>> {
  return adminApiFetch<ApiSuccessResponse<AdminListPage<FaqListItem>>>(
    `/admin/faq?${buildAdminListQuery(params)}`,
  );
}

/** Admin: a single FAQ by id. */
export async function fetchAdminFaq(id: number): Promise<ApiSuccessResponse<FaqRecord>> {
  return adminApiFetch<ApiSuccessResponse<FaqRecord>>(`/admin/faq/${id}`);
}

export async function createAdminFaq(input: FaqInput): Promise<ApiSuccessResponse<FaqRecord>> {
  return adminApiFetch<ApiSuccessResponse<FaqRecord>>("/admin/faq", {
    method: "POST",
    body: input,
  });
}

export async function updateAdminFaq(
  id: number,
  input: Partial<FaqInput>,
): Promise<ApiSuccessResponse<FaqRecord>> {
  return adminApiFetch<ApiSuccessResponse<FaqRecord>>(`/admin/faq/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export async function deleteAdminFaq(id: number): Promise<ApiSuccessResponse<{ id: number }>> {
  return adminApiFetch<ApiSuccessResponse<{ id: number }>>(`/admin/faq/${id}`, {
    method: "DELETE",
  });
}
