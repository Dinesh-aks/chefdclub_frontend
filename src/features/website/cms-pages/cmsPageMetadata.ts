import type { Metadata } from "next";
import { getCmsPageSiteConfig } from "@/config/cmsPages";
import { fetchPublicPage, type PageSlug } from "@/lib/api/pages";

export async function buildCmsPageMetadata(slug: PageSlug): Promise<Metadata> {
  const config = getCmsPageSiteConfig(slug);

  try {
    const response = await fetchPublicPage(slug);
    const title = response.data.title?.trim() || config.label;
    return { title: `${title} | Chef'd Club` };
  } catch {
    return { title: `${config.label} | Chef'd Club` };
  }
}
