import type { ApiSuccessResponse } from "@/lib/api/core/types";
import { apiFetch } from "@/lib/api/core/client";
import type { FaqRecord, FaqCategory } from "./types";

/** Public: the homepage's curated FAQ set (2 Non-Veg + 2 Veg, published only). */
export async function fetchHomeFaqs(): Promise<ApiSuccessResponse<FaqRecord[]>> {
  return apiFetch<ApiSuccessResponse<FaqRecord[]>>("/faq/home");
}

/** Public: published FAQs for one category, e.g. a menu page. */
export async function fetchFaqsByCategory(
  category: FaqCategory,
): Promise<ApiSuccessResponse<FaqRecord[]>> {
  return apiFetch<ApiSuccessResponse<FaqRecord[]>>(`/faq/category/${category}`);
}
