import { buildHref, firstParam, parsePageParam } from "@/lib/searchParams";
import type { PublicMenuTypeSlug } from "@/lib/api/menuCategories";

/** Cards per meal type when every type is shown (each type is paginated on its own). */
export const MENU_CARDS_PER_SECTION = 8;

/** Cards per page when a single meal type is chosen. */
export const MENU_CARDS_PER_TYPE_PAGE = 12;

export const MENU_TYPES: PublicMenuTypeSlug[] = ["breakfast", "lunch", "dinner", "wine"];

/** The `type` query value as a known meal type; anything else (or none) means every type. */
export function parseMenuType(value: string | string[] | undefined): PublicMenuTypeSlug | undefined {
  const slug = firstParam(value);
  return MENU_TYPES.find((type) => type === slug);
}

/** The page of each meal type from the query string, e.g. `?dinner=2` is { dinner: 2 }. */
export function parseMenuPages(
  query: Record<string, string | string[] | undefined>,
): Partial<Record<PublicMenuTypeSlug, number>> {
  const pages: Partial<Record<PublicMenuTypeSlug, number>> = {};
  for (const type of MENU_TYPES) {
    const page = parsePageParam(query[type]);
    if (page > 1) pages[type] = page;
  }
  return pages;
}

/** The /menus/[slug] address for a meal type filter; its pages start over at 1. */
export function menuHref(slug: string, type?: PublicMenuTypeSlug): string {
  return buildHref(`/menus/${slug}`, { type });
}
