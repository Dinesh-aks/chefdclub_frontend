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
  ALL_FAQ_FILTER,
  FAQ_CATEGORIES,
  FAQ_CATEGORY_LABELS,
  faqFiltersActive,
  type FaqFilters as FaqFiltersState,
  type FaqStatusFilter,
} from "@/features/admin/cms/faqs/faqConstants";

interface FaqFiltersProps {
  filters: FaqFiltersState;
  onFilterChange: <K extends keyof FaqFiltersState>(key: K, value: FaqFiltersState[K]) => void;
  onReset: () => void;
}

export function FaqFilters({ filters, onFilterChange, onReset }: FaqFiltersProps) {
  return (
    <section aria-label="Filters" className="space-y-2 rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          disabled={!faqFiltersActive(filters)}
          className="rounded px-1 text-[13px] font-medium text-primary hover:underline disabled:pointer-events-none disabled:opacity-40"
        >
          Reset
        </button>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <Label htmlFor="filter-faq-category">Category</Label>
          <Select
            value={filters.category}
            onValueChange={(value) => onFilterChange("category", value as FaqFiltersState["category"])}
          >
            <SelectTrigger id="filter-faq-category" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FAQ_FILTER}>All categories</SelectItem>
              {FAQ_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {FAQ_CATEGORY_LABELS[category]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="filter-faq-status">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange("status", value as FaqStatusFilter)}
          >
            <SelectTrigger id="filter-faq-status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FAQ_FILTER}>All statuses</SelectItem>
              <SelectItem value="published">Active</SelectItem>
              <SelectItem value="hidden">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
