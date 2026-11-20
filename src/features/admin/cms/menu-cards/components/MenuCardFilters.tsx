"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MenuCategoryRecord } from "@/lib/api/menuCategories";
import { MENU_CARD_TYPE_LABELS, type MenuCardType } from "@/lib/api/menuCards";
import {
  ALL_MENU_CARD_FILTER,
  menuCardFiltersActive,
  type MenuCardFilters as MenuCardFiltersState,
  type MenuCardStatusFilter,
} from "@/features/admin/cms/menu-cards/menuCardFilters";

const MENU_CARD_TYPES = Object.keys(MENU_CARD_TYPE_LABELS).map(Number) as MenuCardType[];

interface MenuCardFiltersProps {
  filters: MenuCardFiltersState;
  categories: MenuCategoryRecord[];
  onFilterChange: <K extends keyof MenuCardFiltersState>(
    key: K,
    value: MenuCardFiltersState[K],
  ) => void;
  onReset: () => void;
}

export function MenuCardFilters({ filters, categories, onFilterChange, onReset }: MenuCardFiltersProps) {
  return (
    <section aria-label="Filters" className="space-y-2 rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          disabled={!menuCardFiltersActive(filters)}
          className="rounded px-1 text-[13px] font-medium text-primary hover:underline disabled:pointer-events-none disabled:opacity-40"
        >
          Reset
        </button>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <Label htmlFor="filter-card-menu">Menu</Label>
          <Select value={filters.menu} onValueChange={(value) => onFilterChange("menu", value)}>
            <SelectTrigger id="filter-card-menu" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_MENU_CARD_FILTER}>All menus</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="filter-card-type">Type</Label>
          <Select value={filters.type} onValueChange={(value) => onFilterChange("type", value)}>
            <SelectTrigger id="filter-card-type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_MENU_CARD_FILTER}>All types</SelectItem>
              {MENU_CARD_TYPES.map((type) => (
                <SelectItem key={type} value={String(type)}>
                  {MENU_CARD_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="filter-card-status">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange("status", value as MenuCardStatusFilter)}
          >
            <SelectTrigger id="filter-card-status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_MENU_CARD_FILTER}>All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
