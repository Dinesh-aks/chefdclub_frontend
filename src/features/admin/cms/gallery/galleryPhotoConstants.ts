import type { GalleryPhotoCategory } from "@/lib/api/gallery";

export const GALLERY_PHOTO_CATEGORY_LABELS: Record<GalleryPhotoCategory, string> = {
  all: "All",
  veg: "Vegetarian",
  "non-veg": "Non-Vegetarian",
};

export const GALLERY_PHOTO_CATEGORIES = Object.keys(
  GALLERY_PHOTO_CATEGORY_LABELS,
) as GalleryPhotoCategory[];
