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
  ALL_MENU_CATEGORY_STATUSES,
  menuCategoryFiltersActive,
  type MenuCategoryFilters,
  type MenuCategoryStatusFilter,
} from "@/features/admin/cms/menu-categories/menuCategoryUtils";

interface MenuCategoriesFiltersProps {
  filters: MenuCategoryFilters;
  onFilterChange: <K extends keyof MenuCategoryFilters>(
    key: K,
    value: MenuCategoryFilters[K],
  ) => void;
  onReset: () => void;
}

export function MenuCategoriesFilters({
  filters,
  onFilterChange,
  onReset,
}: MenuCategoriesFiltersProps) {
  const filtersActive = menuCategoryFiltersActive(filters);

  return (
    <section aria-label="Filters" className="space-y-2 rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          disabled={!filtersActive}
          className="rounded px-1 text-[13px] font-medium text-primary hover:underline disabled:pointer-events-none disabled:opacity-40"
        >
          Reset
        </button>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <Label htmlFor="filter-menu-category-status">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) =>
              onFilterChange("status", value as MenuCategoryStatusFilter)
            }
          >
            <SelectTrigger id="filter-menu-category-status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_MENU_CATEGORY_STATUSES}>All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
