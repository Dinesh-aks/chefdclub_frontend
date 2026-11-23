import type { ApiSuccessResponse } from "@/lib/api/core/types";
import { apiFetch } from "@/lib/api/core/client";
import type { AdminListPage } from "@/lib/api/core/adminList";
import type { Film, FilmCategory } from "./types";

interface FilmListParams {
  category?: FilmCategory;
  page?: number;
  limit?: number;
}

/** Public: one page of films, filtered by category on the server. */
export async function fetchFilms(
  params: FilmListParams = {},
): Promise<ApiSuccessResponse<AdminListPage<Film>>> {
  const query = new URLSearchParams();
  // "all" (or no category) means every category, so it is left out of the query.
  if (params.category && params.category !== "all") query.set("category", params.category);
  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 10));

  return apiFetch<ApiSuccessResponse<AdminListPage<Film>>>(`/films?${query.toString()}`);
}
