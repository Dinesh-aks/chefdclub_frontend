import Link from "next/link";
import { cn } from "@/lib/utils";
import { menuHref } from "@/features/website/menus/data";
import type { PublicMenuType, PublicMenuTypeSlug } from "@/lib/api/menuCategories";

interface MenuTypeFilterProps {
  slug: string;
  /** All active cards in the category (the "All" count). */
  total: number;
  types: PublicMenuType[];
  activeType?: PublicMenuTypeSlug;
}

/**
 * Meal-type chips (All, Breakfast, Lunch, ...). Each is a link to /menus/[slug]?type=..., so
 * choosing one asks the server for just that type's cards.
 */
export function MenuTypeFilter({ slug, total, types, activeType }: MenuTypeFilterProps) {
  if (types.length < 2) return null;

  const chips = [
    { key: "all", label: "All", count: total, type: undefined },
    ...types.map((type) => ({ key: type.slug, label: type.label, count: type.count, type: type.slug })),
  ];

  return (
    <nav className="mt-8 flex flex-wrap gap-2" aria-label="Filter by meal">
      {chips.map((chip) => {
        const isActive = chip.type === activeType;

        return (
          <Link
            key={chip.key}
            href={menuHref(slug, chip.type)}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs tracking-mega uppercase transition-colors",
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
            )}
          >
            {chip.label}
            <span className="ml-2 opacity-70">{chip.count}</span>
          </Link>
        );
      })}
    </nav>
  );
}
