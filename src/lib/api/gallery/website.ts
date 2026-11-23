import type { ApiSuccessResponse } from "@/lib/api/core/types";
import { apiFetch } from "@/lib/api/core/client";
import type { AdminListPage } from "@/lib/api/core/adminList";
import type { GalleryPhotoCategory, PublicGalleryPhoto } from "./types";

interface PublicPhotoListParams {
  category?: GalleryPhotoCategory;
  page?: number;
  limit?: number;
}

/** Public: one page of gallery photos, filtered by category on the server. */
export async function fetchGalleryPhotos(
  params: PublicPhotoListParams = {},
): Promise<ApiSuccessResponse<AdminListPage<PublicGalleryPhoto>>> {
  const query = new URLSearchParams();
  // "all" (or no category) means every category, so it is left out of the query.
  if (params.category && params.category !== "all") query.set("category", params.category);
  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 10));

  return apiFetch<ApiSuccessResponse<AdminListPage<PublicGalleryPhoto>>>(
    `/gallery/photos?${query.toString()}`,
  );
}
