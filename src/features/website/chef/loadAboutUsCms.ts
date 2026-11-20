import { fetchPublicPage } from "@/lib/api/pages";

export interface AboutUsCmsContent {
  bannerUrl: string | null;
  description: string;
}

/** CMS row for About Us — failures return null so the page keeps its static fallback copy. */
export async function loadAboutUsCms(): Promise<AboutUsCmsContent | null> {
  try {
    const response = await fetchPublicPage("about-us");
    const page = response.data;
    return {
      bannerUrl: page.bannerUrl,
      description: page.description?.trim() ?? "",
    };
  } catch {
    return null;
  }
}
