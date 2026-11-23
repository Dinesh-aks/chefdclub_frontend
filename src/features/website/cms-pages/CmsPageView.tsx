import Image from "next/image";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { PageHero } from "@/components/website/PageHero";
import { CmsHtmlContent } from "@/features/website/cms-pages/components/CmsHtmlContent";
import { getCmsPageSiteConfig } from "@/config/cmsPages";
import { ApiError } from "@/lib/api/core/client";
import { toGalleryAssetUrl } from "@/lib/api/gallery";
import { fetchPublicPage, type PageSlug } from "@/lib/api/pages";

interface CmsPageViewProps {
  slug: PageSlug;
}

export async function CmsPageView({ slug }: CmsPageViewProps) {
  const config = getCmsPageSiteConfig(slug);

  let page;
  try {
    const response = await fetchPublicPage(slug);
    page = response.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const title = page.title?.trim() || config.label;

  return (
    <>
      <PageHero eyebrow={config.label} descriptionClassName="max-w-3xl">
        {title}
      </PageHero>

      {config.showBanner && page.bannerUrl ? (
        <Section tone="default" padding="afterHero">
          <Reveal className="mx-auto max-w-5xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border bg-muted">
              <Image
                src={toGalleryAssetUrl(page.bannerUrl)}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 80rem"
                priority
              />
            </div>
          </Reveal>
        </Section>
      ) : null}

      {page.description ? (
        <Section
          tone="default"
          padding={config.showBanner && page.bannerUrl ? "default" : "afterHero"}
        >
          <Reveal className="mx-auto max-w-3xl">
            <CmsHtmlContent html={page.description} />
          </Reveal>
        </Section>
      ) : null}
    </>
  );
}
