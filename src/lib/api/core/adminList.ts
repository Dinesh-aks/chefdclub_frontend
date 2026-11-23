/** Shared paginated admin list response (matches backend `buildAdminListResponse`). */
export interface AdminListPage<T> {
  items: T[];
  page: number;
  limit: number;
  offset: number;
  total: number;
  totalPages: number;
}

export interface AdminListParams {
  page?: number;
  limit?: number;
  offset?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export function buildAdminListQuery(params: AdminListParams): string {
  const query = new URLSearchParams();
  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 10));
  if (params.offset !== undefined) {
    query.set("offset", String(params.offset));
  }
  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }
  if (params.sort) {
    query.set("sort", params.sort);
  }
  if (params.order) {
    query.set("order", params.order);
  }
  for (const [key, value] of Object.entries(params as AdminListParams & Record<string, unknown>)) {
    if (["page", "limit", "offset", "search", "sort", "order"].includes(key)) continue;
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  }
  return query.toString();
}
