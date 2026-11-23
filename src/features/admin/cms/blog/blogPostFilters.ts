export const ALL_BLOG_POST_FILTER = "all";

export type BlogPostStatusFilter = typeof ALL_BLOG_POST_FILTER | "active" | "inactive";

export interface BlogPostFilters {
  /** Category id as a string (Select values are strings), or "all". */
  catId: string;
  status: BlogPostStatusFilter;
}

export const EMPTY_BLOG_POST_FILTERS: BlogPostFilters = {
  catId: ALL_BLOG_POST_FILTER,
  status: ALL_BLOG_POST_FILTER,
};

export function blogPostFiltersActive(filters: BlogPostFilters): boolean {
  return filters.catId !== ALL_BLOG_POST_FILTER || filters.status !== ALL_BLOG_POST_FILTER;
}

export function blogPostFilterParams(filters: BlogPostFilters): { catId?: number; status?: boolean } {
  return {
    ...(filters.catId !== ALL_BLOG_POST_FILTER ? { catId: Number(filters.catId) } : {}),
    ...(filters.status !== ALL_BLOG_POST_FILTER ? { status: filters.status === "active" } : {}),
  };
}
