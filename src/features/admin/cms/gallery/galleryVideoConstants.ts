import type { GalleryVideoCategory } from "@/lib/api/gallery";

export const GALLERY_VIDEO_CATEGORY_LABELS: Record<GalleryVideoCategory, string> = {
  all: "All",
  veg: "Vegetarian",
  "non-veg": "Non-Vegetarian",
  "private-dining": "Private Dining",
};

/** The categories a video can be put in. "all" (0) is only the Films page's "show everything" tab. */
export const GALLERY_VIDEO_CATEGORIES: GalleryVideoCategory[] = ["veg", "non-veg", "private-dining"];
