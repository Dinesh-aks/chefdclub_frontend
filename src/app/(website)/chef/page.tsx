import { ChefPage } from "@/features/website/chef/ChefPage";
import { buildCmsPageMetadata } from "@/features/website/cms-pages/cmsPageMetadata";

export async function generateMetadata() {
  return buildCmsPageMetadata("about-us");
}

export default ChefPage;
