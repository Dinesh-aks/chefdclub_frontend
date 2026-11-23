import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";
import { reserveNavItem } from "@/config/nav";
import { toGalleryAssetUrl } from "@/lib/api/gallery";
import type {
  PublicMenuCategory,
  PublicMenuSection,
  PublicMenuTypeSlug,
} from "@/lib/api/menuCategories";
import {
  MenuCardGallery,
  type MenuGallerySection,
} from "@/features/website/menus/components/MenuCardGallery";
import { MenuTypeFilter } from "@/features/website/menus/components/MenuTypeFilter";

interface MenuCategorySectionProps {
  category: PublicMenuCategory;
  type?: PublicMenuTypeSlug;
}

// A section's pager keeps the meal type filter and the other sections' pages, and changes only its
// own page number, so paging one meal type never resets the others.
function toGallerySection(
  section: PublicMenuSection,
  category: PublicMenuCategory,
  type: PublicMenuTypeSlug | undefined,
): MenuGallerySection {
  const params: Record<string, string | undefined> = { type };
  for (const other of category.sections) {
    if (other.slug !== section.slug && other.page > 1) params[other.slug] = String(other.page);
  }

  return {
    slug: section.slug,
    label: section.label,
    total: section.total,
    page: section.page,
    totalPages: section.totalPages,
    cards: section.items.map((card) => ({
      id: card.id,
      name: card.name,
      typeLabel: card.typeLabel,
      src: card.bannerUrl ? toGalleryAssetUrl(card.bannerUrl) : null,
    })),
    hrefBase: {
      path: `/menus/${category.slug}`,
      params,
      pageParam: section.slug,
      hash: `menu-${section.slug}`,
    },
  };
}

/**
 * One menu category: its name and number of menus, the meal-type chips, and a section per meal
 * type with its own pager. The category description and image are not shown. The cards are the
 * content, and the legacy description is placeholder text.
 */
export function MenuCategorySection({ category, type }: MenuCategorySectionProps) {
  const sections = category.sections.map((section) => toGallerySection(section, category, type));

  return (
    <div className="pt-10">
      <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-3 text-xs tracking-mega text-muted-foreground uppercase">
            <span className="h-px w-6 bg-primary" aria-hidden="true" />
            {category.total} {category.total === 1 ? "menu" : "menus"}
          </p>
          <h2 className="mt-4 text-balance font-serif text-4xl leading-[1.1] font-normal sm:text-5xl">
            {category.name}
          </h2>
        </div>
        <Button asChild size="lg" className="self-start sm:self-auto">
          <Link href={reserveNavItem.href}>Reserve this menu</Link>
        </Button>
      </Reveal>

      <MenuTypeFilter
        slug={category.slug}
        total={category.total}
        types={category.types}
        activeType={type}
      />

      <MenuCardGallery sections={sections} />
    </div>
  );
}
