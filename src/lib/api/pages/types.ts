export type PageSlug = "about-us" | "privacy-policy" | "terms-and-conditions";

export interface CmsPageRecord {
  id: number;
  slug: PageSlug;
  title: string | null;
  short: string | null;
  description: string | null;
  banner: string | null;
  bannerUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  addDate: string;
}

/** What the admin editor loads and gets back after saving — no id/slug/SEO/addDate. */
export type CmsPageAdminView = Partial<
  Pick<CmsPageRecord, "title" | "short" | "description" | "bannerUrl">
>;

export interface CmsPageFormInput {
  title?: string;
  short?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  banner?: File;
}
