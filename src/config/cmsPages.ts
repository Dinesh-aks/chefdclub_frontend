import type { PageSlug } from "@/lib/api/pages";

export interface CmsPageSiteConfig {
  slug: PageSlug;
  label: string;
  path: string;
  showShort: boolean;
  showBanner: boolean;
}

export const CMS_SITE_PAGES: CmsPageSiteConfig[] = [
  {
    slug: "about-us",
    label: "About Us",
    path: "/chef",
    showShort: true,
    showBanner: true,
  },
  {
    slug: "privacy-policy",
    label: "Privacy Policy",
    path: "/privacy-policy",
    showShort: false,
    showBanner: false,
  },
  {
    slug: "terms-and-conditions",
    label: "Terms & Conditions",
    path: "/terms-and-conditions",
    showShort: false,
    showBanner: false,
  },
];

export function getCmsPageSiteConfig(slug: PageSlug): CmsPageSiteConfig {
  const config = CMS_SITE_PAGES.find((page) => page.slug === slug);
  if (!config) {
    throw new Error(`Unknown CMS page slug: ${slug}`);
  }
  return config;
}
