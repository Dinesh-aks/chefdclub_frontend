import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PublicMenuTab } from "@/lib/api/menuCategories";

interface MenuTabsProps {
  tabs: PublicMenuTab[];
  activeSlug: string;
}

/**
 * Tab-styled navigation between the /menus/[slug] routes (one per active menu category). Kept as
 * plain links (not Radix Tabs) so each menu is its own shareable, indexable
 * page rather than client-side-only state.
 */
export function MenuTabs({ tabs, activeSlug }: MenuTabsProps) {
  return (
    <nav
      aria-label="Menu categories"
      className="flex gap-8 border-b border-border"
    >
      {tabs.map((tab) => {
        const isActive = tab.slug === activeSlug;

        return (
          <Link
            key={tab.slug}
            href={`/menus/${tab.slug}`}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 border-transparent pb-4 text-xs tracking-mega uppercase transition-colors",
              isActive
                ? "border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.name}
          </Link>
        );
      })}
    </nav>
  );
}
