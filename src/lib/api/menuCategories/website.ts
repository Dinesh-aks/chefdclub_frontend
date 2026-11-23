import type { ApiSuccessResponse } from "@/lib/api/core/types";
import { apiFetch } from "@/lib/api/core/client";
import type { PublicMenuCategory, PublicMenuTab, PublicMenuTypeSlug } from "./types";

/** Public website: the Menus page tabs (active categories, in display order). */
export async function fetchPublicMenuTabs(): Promise<ApiSuccessResponse<PublicMenuTab[]>> {
  return apiFetch<ApiSuccessResponse<PublicMenuTab[]>>("/menu/categories");
}

/**
 * Public website: one active menu category with a page of cards per meal type. `pages` is the page
 * to show for each meal type (default 1), `type` narrows it to one meal type, and `limit` is the
 * number of cards per page (404 when the category is missing or inactive).
 */
export async function fetchPublicMenuCategory(
  slug: string,
  params: {
    type?: PublicMenuTypeSlug;
    pages?: Partial<Record<PublicMenuTypeSlug, number>>;
    limit?: number;
  } = {},
): Promise<ApiSuccessResponse<PublicMenuCategory>> {
  const query = new URLSearchParams();
  if (params.type) query.set("type", params.type);
  for (const [typeSlug, page] of Object.entries(params.pages ?? {})) {
    if (page && page > 1) query.set(typeSlug, String(page));
  }
  query.set("limit", String(params.limit ?? 8));
  return apiFetch<ApiSuccessResponse<PublicMenuCategory>>(
    `/menu/categories/${encodeURIComponent(slug)}?${query.toString()}`,
  );
}
