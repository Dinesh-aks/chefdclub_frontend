import { Suspense } from "react";
import { InkDots } from "@/components/shared/InkDots";
import { Section } from "@/components/shared/Section";
import { parsePageParam } from "@/lib/searchParams";
import { GalleryCta } from "@/features/website/gallery/components/GalleryCta";
import { GalleryFilterTabs } from "@/features/website/gallery/components/GalleryFilterTabs";
import { GalleryGrid } from "@/features/website/gallery/components/GalleryGrid";
import { GalleryHero } from "@/features/website/gallery/components/GalleryHero";
import { parseGalleryCategory } from "@/features/website/gallery/data";

/** The category and page live in the URL, so every tab or page is a fresh request for just that data. */
export async function GalleryPage({ searchParams }: PageProps<"/gallery">) {
  const params = await searchParams;
  const category = parseGalleryCategory(params.category);
  const page = parsePageParam(params.page);

  return (
    <>
      <GalleryHero />
      <Section tone="default" padding="afterHero">
        <GalleryFilterTabs activeSlug={category} />
        <Suspense
          key={`${category}-${page}`}
          fallback={
            <div className="mt-10">
              <InkDots label="Loading photos" />
            </div>
          }
        >
          <GalleryGrid category={category} page={page} />
        </Suspense>
      </Section>
      <GalleryCta />
    </>
  );
}
