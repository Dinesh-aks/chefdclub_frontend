import { buildHref, firstParam } from "@/lib/searchParams";
import type { FilmCategory } from "@/lib/api/films";

export interface FilmCategoryTab {
  slug: FilmCategory;
  label: string;
}

export const filmCategories: FilmCategoryTab[] = [
  { slug: "all", label: "All" },
  { slug: "veg", label: "Vegetarian" },
  { slug: "non-veg", label: "Non Vegetarian" },
  { slug: "private-dining", label: "Private Dining" },
];

/** Films shown per page; the API is asked for exactly this many. */
export const FILMS_PER_PAGE = 20;

/** The `category` query value as a known category; anything else is "all". */
export function parseFilmCategory(value: string | string[] | undefined): FilmCategory {
  const slug = firstParam(value);
  return filmCategories.find((category) => category.slug === slug)?.slug ?? "all";
}

/** The /films address for a category and page; defaults (all, page 1) are left out. */
export function filmsHref(category: FilmCategory, page = 1): string {
  return buildHref("/films", {
    category: category === "all" ? undefined : category,
    page: page > 1 ? page : undefined,
  });
}
