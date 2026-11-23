"use client";

import type { MenuCategoryRecord } from "@/lib/api/menuCategories";
import { FormCard } from "@/components/admin/FormSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MenuCategoryFormState } from "@/features/admin/cms/menu-categories/menuCategoryConstants";
import { formatBusinessDateTime } from "@/lib/formatDateTime";

interface MenuCategoryFormFieldsProps {
  form: MenuCategoryFormState;
  onChange: (form: MenuCategoryFormState) => void;
  editing: boolean;
  category: MenuCategoryRecord | null;
}

export function MenuCategoryFormFields({
  form,
  onChange,
  editing,
  category,
}: MenuCategoryFormFieldsProps) {
  return (
    <div>
      <FormCard title="Menu Category" description="Name, display order and visibility.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-2">
            <Label htmlFor="category-name" required>Name</Label>
            <Input
              id="category-name"
              value={form.name}
              onChange={(event) => onChange({ ...form, name: event.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category-sort">Order</Label>
            <Input
              id="category-sort"
              type="number"
              min={0}
              value={form.sort}
              onChange={(event) => onChange({ ...form, sort: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category-status">Status</Label>
            <Select
              value={form.status ? "active" : "inactive"}
              onValueChange={(value) => onChange({ ...form, status: value === "active" })}
            >
              <SelectTrigger id="category-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Set automatically on save; shown as a footer so the card stays one block. */}
        {editing && category ? (
          <dl className="mt-6 grid gap-4 border-t border-border pt-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-muted-foreground">Created</dt>
              <dd className="mt-1 tabular-nums">{formatBusinessDateTime(category.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted-foreground">Last updated</dt>
              <dd className="mt-1 tabular-nums">{formatBusinessDateTime(category.updatedAt)}</dd>
            </div>
          </dl>
        ) : null}
      </FormCard>
    </div>
  );
}
