import Link from "next/link";
import { cn } from "@/lib/utils";
import { filmCategories, filmsHref } from "@/features/website/films/data";
import type { FilmCategory } from "@/lib/api/films";

interface FilmsFilterTabsProps {
  activeSlug: FilmCategory;
}

/**
 * Category tabs for the films grid. Each is a link to /films?category=..., so choosing one asks
 * the server for just that category's films (and the address can be shared).
 */
export function FilmsFilterTabs({ activeSlug }: FilmsFilterTabsProps) {
  return (
    <nav aria-label="Film categories" className="flex flex-wrap gap-8 border-b border-border">
      {filmCategories.map((category) => {
        const isActive = category.slug === activeSlug;

        return (
          <Link
            key={category.slug}
            href={filmsHref(category.slug)}
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
