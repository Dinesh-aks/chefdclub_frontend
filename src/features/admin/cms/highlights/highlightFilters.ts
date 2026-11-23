export const ALL_HIGHLIGHT_FILTER = "all";

export type HighlightStatusFilter = typeof ALL_HIGHLIGHT_FILTER | "active" | "inactive";

export interface HighlightFilters {
  status: HighlightStatusFilter;
}

export const EMPTY_HIGHLIGHT_FILTERS: HighlightFilters = {
  status: ALL_HIGHLIGHT_FILTER,
};

export function highlightFiltersActive(filters: HighlightFilters): boolean {
  return filters.status !== ALL_HIGHLIGHT_FILTER;
}

export function highlightFilterParams(filters: HighlightFilters): { status?: boolean } {
  return filters.status !== ALL_HIGHLIGHT_FILTER ? { status: filters.status === "active" } : {};
}
