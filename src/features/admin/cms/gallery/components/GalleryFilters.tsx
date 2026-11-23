"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ANY_GALLERY_CATEGORY,
  galleryFiltersActive,
  type GalleryFilters as GalleryFiltersState,
} from "@/features/admin/cms/gallery/galleryFilters";

interface GalleryFiltersProps {
  /** Prefix for element ids, so photos and videos don't clash. */
  idPrefix: string;
  filters: GalleryFiltersState;
  /** Category value and its display label, in dropdown order. */
  categories: { value: string; label: string }[];
  onFilterChange: <K extends keyof GalleryFiltersState>(key: K, value: GalleryFiltersState[K]) => void;
  onReset: () => void;
}

export function GalleryFilters({
  idPrefix,
  filters,
  categories,
  onFilterChange,
  onReset,
}: GalleryFiltersProps) {
  return (
    <section aria-label="Filters" className="space-y-2 rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          disabled={!galleryFiltersActive(filters)}
          className="rounded px-1 text-[13px] font-medium text-primary hover:underline disabled:pointer-events-none disabled:opacity-40"
        >
          Reset
        </button>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <Label htmlFor={`${idPrefix}-category`}>Category</Label>
          <Select value={filters.category} onValueChange={(value) => onFilterChange("category", value)}>
            <SelectTrigger id={`${idPrefix}-category`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY_GALLERY_CATEGORY}>All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
