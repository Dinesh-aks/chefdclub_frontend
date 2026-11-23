import { buildHref, firstParam } from "@/lib/searchParams";
import type { GalleryPhotoCategory } from "@/lib/api/gallery";

export interface GalleryCategory {
  slug: GalleryPhotoCategory;
  label: string;
}

export const galleryCategories: GalleryCategory[] = [
  { slug: "all", label: "All" },
  { slug: "veg", label: "Vegetarian" },
  { slug: "non-veg", label: "Non Vegetarian" },
];

/** Photos shown per page; the API is asked for exactly this many. */
export const GALLERY_PHOTOS_PER_PAGE = 9;

/** The `category` query value as a known category; anything else is "all". */
export function parseGalleryCategory(value: string | string[] | undefined): GalleryPhotoCategory {
  const slug = firstParam(value);
  return galleryCategories.find((category) => category.slug === slug)?.slug ?? "all";
}

/** The /gallery address for a category and page; defaults (all, page 1) are left out. */
export function galleryHref(category: GalleryPhotoCategory, page = 1): string {
  return buildHref("/gallery", {
    category: category === "all" ? undefined : category,
    page: page > 1 ? page : undefined,
  });
}
