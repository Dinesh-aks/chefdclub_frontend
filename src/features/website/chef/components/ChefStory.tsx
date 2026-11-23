import { CaptionedImage } from "@/components/shared/CaptionedImage";
import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { CmsHtmlContent } from "@/features/website/cms-pages/components/CmsHtmlContent";
import { toGalleryAssetUrl } from "@/lib/api/gallery";
import "./chef-story-cms.css";

interface ChefStoryProps {
  bannerUrl?: string | null;
  /** Main CMS body (About Us description). */
  bodyHtml?: string;
}

export function ChefStory({ bannerUrl, bodyHtml }: ChefStoryProps) {
  const imageSrc = bannerUrl ? toGalleryAssetUrl(bannerUrl) : undefined;

  return (
    <Section tone="default" padding="afterHero">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
        <Reveal>
          <CaptionedImage
            src={imageSrc}
            alt="Chef Ashish Poddar plating a dish in the Keppel Bay kitchen"
            title="From the Keppel Bay kitchen"
            tag="Chef Ashish Poddar"
            aspect="aspect-[4/5]"
            priority={Boolean(imageSrc)}
          />
        </Reveal>

        <Reveal className="min-w-0 max-w-2xl">
          {bodyHtml ? (
            <>
              <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-mega text-muted-foreground">
                <span className="h-px w-6 bg-primary" aria-hidden="true" />
                Love made visible
              </div>
              <CmsHtmlContent
                html={bodyHtml}
                className="chef-story-cms text-lg [&_p]:text-lg"
              />
            </>
          ) : null}
        </Reveal>
      </div>
    </Section>
  );
}
