export const ALL_MENU_CATEGORY_STATUSES = "all";

export type MenuCategoryStatusFilter = typeof ALL_MENU_CATEGORY_STATUSES | "active" | "inactive";

export type MenuCategoryFilters = {
  status: MenuCategoryStatusFilter;
};

export const EMPTY_MENU_CATEGORY_FILTERS: MenuCategoryFilters = {
  status: ALL_MENU_CATEGORY_STATUSES,
};

export function menuCategoryFiltersActive(filters: MenuCategoryFilters): boolean {
  return filters.status !== ALL_MENU_CATEGORY_STATUSES;
}

export function menuCategoryFilterParams(filters: MenuCategoryFilters): { status?: boolean } {
  if (filters.status === "active") return { status: true };
  if (filters.status === "inactive") return { status: false };
  return {};
}
