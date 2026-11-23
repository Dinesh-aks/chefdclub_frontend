import type { AdminListParams } from "@/lib/api/core/adminList";

export interface MenuCategoryRecord {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  imageUrl: string;
  banner: string | null;
  bannerUrl: string | null;
  status: boolean;
  sort: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface MenuCategoryFormInput {
  name: string;
  /** Optional: the backend generates it from the name when a category is created without one. */
  slug?: string;
  description?: string;
  status: boolean;
  sort: number;
  image?: File;
  banner?: File;
}
export type AdminMenuCategoryListParams = AdminListParams & {
  status?: boolean;
};

/** A tab on the public Menus page. */
export interface PublicMenuTab {
  slug: string;
  name: string;
}

/** A photo card inside a public menu category. */
export interface PublicMenuCard {
  id: number;
  name: string;
  bannerUrl: string | null;
  type: number;
  typeLabel: string;
}

/** Meal types, as used in the Menus page query string (`?type=dinner`). */
export type PublicMenuTypeSlug = "breakfast" | "lunch" | "dinner" | "wine";

/** One meal type of a category with its number of cards (for the filter chips). */
export interface PublicMenuType {
  slug: PublicMenuTypeSlug;
  label: string;
  count: number;
}

/**
 * One meal type's own page of cards. Every meal type is paginated on its own, so each section has
 * its own page number.
 */
export interface PublicMenuSection {
  slug: PublicMenuTypeSlug;
  label: string;
  /** All active cards of this meal type. */
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  items: PublicMenuCard[];
}

/**
 * One active menu category for the public Menus page: its name, the meal types it has, and one
 * page of cards per meal type (just the one asked for when filtered).
 */
export interface PublicMenuCategory extends PublicMenuTab {
  /** All active cards in the category, whatever the filter. */
  total: number;
  types: PublicMenuType[];
  sections: PublicMenuSection[];
}
