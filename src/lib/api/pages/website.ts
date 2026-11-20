import type { ApiSuccessResponse } from "@/lib/api/core/types";
import { apiFetch } from "@/lib/api/core/client";
import type { CmsPageRecord, PageSlug } from "./types";

/** Public website: About Us, Privacy Policy, Terms & Conditions. */
export async function fetchPublicPage(slug: PageSlug): Promise<ApiSuccessResponse<CmsPageRecord>> {
  return apiFetch<ApiSuccessResponse<CmsPageRecord>>(`/pages/${slug}`);
}
