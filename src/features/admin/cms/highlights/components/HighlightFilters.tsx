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
  ALL_HIGHLIGHT_FILTER,
  highlightFiltersActive,
  type HighlightFilters as HighlightFiltersState,
  type HighlightStatusFilter,
} from "@/features/admin/cms/highlights/highlightFilters";

interface HighlightFiltersProps {
  filters: HighlightFiltersState;
  onFilterChange: <K extends keyof HighlightFiltersState>(
    key: K,
    value: HighlightFiltersState[K],
  ) => void;
  onReset: () => void;
}

export function HighlightFilters({ filters, onFilterChange, onReset }: HighlightFiltersProps) {
  return (
    <section aria-label="Filters" className="space-y-2 rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          disabled={!highlightFiltersActive(filters)}
          className="rounded px-1 text-[13px] font-medium text-primary hover:underline disabled:pointer-events-none disabled:opacity-40"
        >
          Reset
        </button>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <Label htmlFor="filter-highlight-status">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange("status", value as HighlightStatusFilter)}
          >
            <SelectTrigger id="filter-highlight-status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_HIGHLIGHT_FILTER}>All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
