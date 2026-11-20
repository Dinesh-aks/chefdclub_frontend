import type { FaqCategory } from "@/lib/api/faq";

export const FAQ_CATEGORY_LABELS: Record<FaqCategory, string> = {
  veg: "Vegetarian",
  "non-veg": "Non-Vegetarian",
  "wine-pairing": "Wine Pairing",
};

export const FAQ_CATEGORIES = Object.keys(FAQ_CATEGORY_LABELS) as FaqCategory[];

export interface FaqFormState {
  question: string;
  answer: string;
  category: FaqCategory;
  sort: string;
  status: boolean;
}

export const EMPTY_FAQ_FORM: FaqFormState = {
  question: "",
  answer: "",
  category: "veg",
  sort: "1",
  status: true,
};

export const ALL_FAQ_FILTER = "all";

export type FaqStatusFilter = typeof ALL_FAQ_FILTER | "published" | "hidden";

export interface FaqFilters {
  category: FaqCategory | typeof ALL_FAQ_FILTER;
  status: FaqStatusFilter;
}

export const EMPTY_FAQ_FILTERS: FaqFilters = {
  category: ALL_FAQ_FILTER,
  status: ALL_FAQ_FILTER,
};

export function faqFiltersActive(filters: FaqFilters): boolean {
  return filters.category !== ALL_FAQ_FILTER || filters.status !== ALL_FAQ_FILTER;
}

export function faqFilterParams(filters: FaqFilters): { category?: FaqCategory; status?: boolean } {
  return {
    ...(filters.category !== ALL_FAQ_FILTER ? { category: filters.category } : {}),
    ...(filters.status !== ALL_FAQ_FILTER ? { status: filters.status === "published" } : {}),
  };
}
