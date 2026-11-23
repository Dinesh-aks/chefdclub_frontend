import type { MenuCardType } from "@/lib/api/menuCards";

export const ALL_MENU_CARD_FILTER = "all";

export type MenuCardStatusFilter = typeof ALL_MENU_CARD_FILTER | "active" | "inactive";

export interface MenuCardFilters {
  /** Menu category id as a string (Select values are strings), or "all". */
  menu: string;
  /** Meal type id as a string, or "all". */
  type: string;
  status: MenuCardStatusFilter;
}

export const EMPTY_MENU_CARD_FILTERS: MenuCardFilters = {
  menu: ALL_MENU_CARD_FILTER,
  type: ALL_MENU_CARD_FILTER,
  status: ALL_MENU_CARD_FILTER,
};

export function menuCardFiltersActive(filters: MenuCardFilters): boolean {
  return (
    filters.menu !== ALL_MENU_CARD_FILTER ||
    filters.type !== ALL_MENU_CARD_FILTER ||
    filters.status !== ALL_MENU_CARD_FILTER
  );
}

export function menuCardFilterParams(filters: MenuCardFilters): {
  menu?: number;
  type?: MenuCardType;
  status?: boolean;
} {
  return {
    ...(filters.menu !== ALL_MENU_CARD_FILTER ? { menu: Number(filters.menu) } : {}),
    ...(filters.type !== ALL_MENU_CARD_FILTER ? { type: Number(filters.type) as MenuCardType } : {}),
    ...(filters.status !== ALL_MENU_CARD_FILTER ? { status: filters.status === "active" } : {}),
  };
}
