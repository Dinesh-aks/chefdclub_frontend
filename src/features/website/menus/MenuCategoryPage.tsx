import { notFound } from "next/navigation";
import { Section } from "@/components/shared/Section";
import { ApiError } from "@/lib/api/core/client";
import {
  fetchPublicMenuCategory,
  fetchPublicMenuTabs,
  type PublicMenuTypeSlug,
} from "@/lib/api/menuCategories";
import { MenuCategorySection } from "@/features/website/menus/components/MenuCategorySection";
import { MenusCta } from "@/features/website/menus/components/MenusCta";
import { MenusHero } from "@/features/website/menus/components/MenusHero";
import { MenuTabs } from "@/features/website/menus/components/MenuTabs";
import {
  MENU_CARDS_PER_SECTION,
  MENU_CARDS_PER_TYPE_PAGE,
  parseMenuPages,
  parseMenuType,
} from "@/features/website/menus/data";

// A missing or inactive category is a 404; any other error is a real failure and should surface.
async function loadCategory(
  slug: string,
  type: PublicMenuTypeSlug | undefined,
  pages: Partial<Record<PublicMenuTypeSlug, number>>,
) {
  try {
    const limit = type ? MENU_CARDS_PER_TYPE_PAGE : MENU_CARDS_PER_SECTION;
    return (await fetchPublicMenuCategory(slug, { type, pages, limit })).data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

/**
 * Each meal type is paginated on its own and its page lives in the URL (`?dinner=2`), so every
 * pager click asks the API for just that meal type's cards.
 */
export async function MenuCategoryPage({ params, searchParams }: PageProps<"/menus/[slug]">) {
  const { slug } = await params;
  const query = await searchParams;
  const type = parseMenuType(query.type);
  const pages = parseMenuPages(query);
  const [category, tabs] = await Promise.all([loadCategory(slug, type, pages), fetchPublicMenuTabs()]);

  return (
    <>
      <MenusHero />
      <Section tone="default" padding="afterHero">
        <MenuTabs tabs={tabs.data} activeSlug={slug} />
        <MenuCategorySection category={category} type={type} />
      </Section>
      <MenusCta />
    </>
  );
}
