import { buildCmsPageMetadata } from "@/features/website/cms-pages/cmsPageMetadata";
import { CmsPageView } from "@/features/website/cms-pages/CmsPageView";

// Content comes from the CMS, so render on every request instead of freezing it at build time.
export const revalidate = 60;

export async function generateMetadata() {
  return buildCmsPageMetadata("terms-and-conditions");
}

export default function TermsAndConditionsPage() {
  return <CmsPageView slug="terms-and-conditions" />;
}
