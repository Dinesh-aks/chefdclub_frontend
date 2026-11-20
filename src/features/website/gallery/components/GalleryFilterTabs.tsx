import Link from "next/link";
import { cn } from "@/lib/utils";
import { galleryCategories, galleryHref } from "@/features/website/gallery/data";
import type { GalleryPhotoCategory } from "@/lib/api/gallery";

interface GalleryFilterTabsProps {
  activeSlug: GalleryPhotoCategory;
}

/**
 * Category tabs for the gallery grid. Each is a link to /gallery?category=..., so choosing one
 * asks the server for just that category's photos (and the address can be shared).
 */
export function GalleryFilterTabs({ activeSlug }: GalleryFilterTabsProps) {
  return (
    <nav aria-label="Gallery categories" className="flex flex-wrap gap-8 border-b border-border">
      {galleryCategories.map((category) => {
        const isActive = category.slug === activeSlug;

        return (
          <Link
            key={category.slug}
            href={galleryHref(category.slug)}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 border-transparent pb-4 text-xs tracking-mega uppercase transition-colors",
              isActive
                ? "border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {category.label}
          </Link>
        );
      })}
    </nav>
  );
}
