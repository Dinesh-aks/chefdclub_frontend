"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BlogCategoryRecord } from "@/lib/api/blog";
import {
  ALL_BLOG_POST_FILTER,
  blogPostFiltersActive,
  type BlogPostFilters as BlogPostFiltersState,
  type BlogPostStatusFilter,
} from "@/features/admin/cms/blog/blogPostFilters";

interface BlogPostFiltersProps {
  filters: BlogPostFiltersState;
  categories: BlogCategoryRecord[];
  onFilterChange: <K extends keyof BlogPostFiltersState>(
    key: K,
    value: BlogPostFiltersState[K],
  ) => void;
  onReset: () => void;
}

export function BlogPostFilters({
  filters,
  categories,
  onFilterChange,
  onReset,
}: BlogPostFiltersProps) {
  return (
    <section aria-label="Filters" className="space-y-2 rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          disabled={!blogPostFiltersActive(filters)}
          className="rounded px-1 text-[13px] font-medium text-primary hover:underline disabled:pointer-events-none disabled:opacity-40"
        >
          Reset
        </button>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <Label htmlFor="filter-post-category">Category</Label>
          <Select value={filters.catId} onValueChange={(value) => onFilterChange("catId", value)}>
            <SelectTrigger id="filter-post-category" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_BLOG_POST_FILTER}>All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="filter-post-status">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange("status", value as BlogPostStatusFilter)}
          >
            <SelectTrigger id="filter-post-status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_BLOG_POST_FILTER}>All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
