import { ChefPage } from "@/features/website/chef/ChefPage";
import { buildCmsPageMetadata } from "@/features/website/cms-pages/cmsPageMetadata";

// Content comes from the CMS, so render on every request instead of freezing it at build time.
export const revalidate = 60;

export async function generateMetadata() {
  return buildCmsPageMetadata("about-us");
}

export default ChefPage;
