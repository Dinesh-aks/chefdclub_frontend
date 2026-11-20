import { CMS_SITE_PAGES, getCmsPageSiteConfig, type CmsPageSiteConfig } from "@/config/cmsPages";
import type { CmsPageAdminView, PageSlug } from "@/lib/api/pages";

export type CmsPageConfig = CmsPageSiteConfig & { adminHref: string };

export const CMS_PAGES: CmsPageConfig[] = CMS_SITE_PAGES.map((page) => ({
  ...page,
  adminHref: `/admin/cms/${page.slug}`,
}));

export function getCmsPageConfig(slug: PageSlug): CmsPageConfig {
  const site = getCmsPageSiteConfig(slug);
  return { ...site, adminHref: `/admin/cms/${slug}` };
}

export interface CmsPageFormState {
  title: string;
  short: string;
  description: string;
}

export function cmsPageToFormState(page: CmsPageAdminView): CmsPageFormState {
  return {
    title: page.title ?? "",
    short: page.short ?? "",
    description: page.description ?? "",
  };
}
