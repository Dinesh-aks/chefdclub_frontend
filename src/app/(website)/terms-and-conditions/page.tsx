import { buildCmsPageMetadata } from "@/features/website/cms-pages/cmsPageMetadata";
import { CmsPageView } from "@/features/website/cms-pages/CmsPageView";

export async function generateMetadata() {
  return buildCmsPageMetadata("terms-and-conditions");
}

export default function TermsAndConditionsPage() {
  return <CmsPageView slug="terms-and-conditions" />;
}
