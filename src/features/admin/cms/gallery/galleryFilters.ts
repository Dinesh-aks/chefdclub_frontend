/**
 * "Any category" sentinel. "all" can't be used for this because it is also a real gallery category
 * (items shown under every tab), so it would be ambiguous.
 */
export const ANY_GALLERY_CATEGORY = "any";

export interface GalleryFilters {
  category: string;
}

export const EMPTY_GALLERY_FILTERS: GalleryFilters = { category: ANY_GALLERY_CATEGORY };

export function galleryFiltersActive(filters: GalleryFilters): boolean {
  return filters.category !== ANY_GALLERY_CATEGORY;
}

/** Query params for the list API; the category is omitted when no category is picked. */
export function galleryFilterParams<TCategory extends string>(
  filters: GalleryFilters,
): { category?: TCategory } {
  return filters.category !== ANY_GALLERY_CATEGORY ? { category: filters.category as TCategory } : {};
}
