import type { ApiSuccessResponse } from "@/lib/api/core/types";
import { adminApiFetch } from "@/lib/api/core/adminClient";
import type { CmsPageAdminView, CmsPageFormInput, PageSlug } from "./types";


/** `fields` limits the response to what this page's form shows (default: all four). */
export async function fetchAdminPage(
  slug: PageSlug,
  fields?: (keyof CmsPageAdminView)[],
): Promise<ApiSuccessResponse<CmsPageAdminView>> {
  const query = fields?.length ? `?fields=${fields.join(",")}` : "";
  return adminApiFetch<ApiSuccessResponse<CmsPageAdminView>>(`/admin/pages/${slug}${query}`);
}

export async function updateAdminPage(
  slug: PageSlug,
  input: CmsPageFormInput,
): Promise<ApiSuccessResponse<CmsPageAdminView>> {
  const formData = new FormData();
  if (input.title !== undefined) formData.set("title", input.title);
  if (input.short !== undefined) formData.set("short", input.short);
  if (input.description !== undefined) formData.set("description", input.description);
  if (input.seoTitle !== undefined) formData.set("seoTitle", input.seoTitle);
  if (input.seoDescription !== undefined) formData.set("seoDescription", input.seoDescription);
  if (input.banner) formData.set("banner", input.banner);
  return adminApiFetch<ApiSuccessResponse<CmsPageAdminView>>(`/admin/pages/${slug}`, {
    method: "PATCH",
    body: formData,
  });
}
