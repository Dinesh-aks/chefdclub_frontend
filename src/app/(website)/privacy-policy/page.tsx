import { buildCmsPageMetadata } from "@/features/website/cms-pages/cmsPageMetadata";
import { CmsPageView } from "@/features/website/cms-pages/CmsPageView";

export async function generateMetadata() {
  return buildCmsPageMetadata("privacy-policy");
}

export default function PrivacyPolicyPage() {
  return <CmsPageView slug="privacy-policy" />;
}
