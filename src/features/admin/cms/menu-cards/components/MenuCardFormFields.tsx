"use client";

import type { RefObject } from "react";
import { toGalleryAssetUrl } from "@/lib/api/gallery";
import type { MenuCategoryRecord } from "@/lib/api/menuCategories";
import {
  MENU_CARD_TYPE_LABELS,
  type MenuCardRecord,
  type MenuCardType,
} from "@/lib/api/menuCards";
import { AdminFileInput } from "@/components/admin/AdminFileInput";
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
import type { MenuCardFormState } from "@/features/admin/cms/menu-cards/menuCardConstants";
import { formatBusinessDateTime } from "@/lib/formatDateTime";

const MENU_CARD_TYPES = Object.keys(MENU_CARD_TYPE_LABELS).map(Number) as MenuCardType[];

interface MenuCardFormFieldsProps {
  form: MenuCardFormState;
  onChange: (next: MenuCardFormState) => void;
  categories: MenuCategoryRecord[];
  editing: boolean;
  card: MenuCardRecord | null;
  bannerInputRef: RefObject<HTMLInputElement | null>;
}

export function MenuCardFormFields({
  form,
  onChange,
  categories,
  editing,
  card,
  bannerInputRef,
}: MenuCardFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <FormCard
        title="Basic Information"
        description="Name, URL slug, how this card is categorized, and its display order."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="card-name" required>Name</Label>
            <Input
              id="card-name"
              value={form.name}
              onChange={(event) => onChange({ ...form, name: event.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-slug" required>Slug</Label>
            <Input
              id="card-slug"
              value={form.slug}
              onChange={(event) => onChange({ ...form, slug: event.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-menu" required>Menu category</Label>
            <Select value={form.menu} onValueChange={(value) => onChange({ ...form, menu: value })}>
              <SelectTrigger id="card-menu" className="w-full">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-type" required>Type</Label>
            <Select value={form.type} onValueChange={(value) => onChange({ ...form, type: value })}>
              <SelectTrigger id="card-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MENU_CARD_TYPES.map((type) => (
                  <SelectItem key={type} value={String(type)}>
                    {MENU_CARD_TYPE_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-sort">Order</Label>
            <Input
              id="card-sort"
              type="number"
              min={0}
              value={form.sort}
              onChange={(event) => onChange({ ...form, sort: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-status">Status</Label>
            <Select
              value={form.status ? "active" : "inactive"}
              onValueChange={(value) => onChange({ ...form, status: value === "active" })}
            >
              <SelectTrigger id="card-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Set automatically on save; shown as a footer so the card fills the column. */}
        {editing && card ? (
          <dl className="mt-6 grid gap-4 border-t border-border pt-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-muted-foreground">Created</dt>
              <dd className="mt-1 tabular-nums">{formatBusinessDateTime(card.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted-foreground">Last updated</dt>
              <dd className="mt-1 tabular-nums">{formatBusinessDateTime(card.updatedAt)}</dd>
            </div>
          </dl>
        ) : null}
      </FormCard>

      <FormCard
        title="Menu Image"
        description={
          editing
            ? "Optional. A new upload replaces the current image when you save."
            : "Upload the menu card artwork for the website."
        }
      >
        <AdminFileInput
          id="card-banner"
          inputRef={bannerInputRef}
          currentImageUrl={card?.bannerUrl ? toGalleryAssetUrl(card.bannerUrl) : null}
          currentImageAlt={form.name.trim() || "Menu card"}
          className="flex-col items-stretch"
        />
      </FormCard>
    </div>
  );
}
