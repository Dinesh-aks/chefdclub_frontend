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

async function loadCmsPage(slug: PageSlug) {
  try {
    return (await fetchPublicPage(slug)).data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    return null;
  }
}

export async function CmsPageView({ slug }: CmsPageViewProps) {
  const config = getCmsPageSiteConfig(slug);
  const page = await loadCmsPage(slug);

  if (!page) {
    return (
      <>
        <PageHero eyebrow={config.label} descriptionClassName="max-w-3xl">
          {config.label}
        </PageHero>
        <Section tone="default" padding="afterHero">
          <Reveal className="mx-auto max-w-3xl">
            <p className="text-muted-foreground">
              This page is temporarily unavailable. Please try again shortly.
            </p>
          </Reveal>
        </Section>
      </>
    );
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
