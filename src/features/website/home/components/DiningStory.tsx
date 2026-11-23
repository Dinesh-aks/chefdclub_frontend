import { CaptionedImage } from "@/components/shared/CaptionedImage";
import { Heading } from "@/components/shared/Heading";
import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { TextLink } from "@/components/shared/TextLink";
import { toGalleryAssetUrl } from "@/lib/api/gallery";
import { fetchPublicSpotlight, type PublicSpotlight } from "@/lib/api/spotlight";

// A failed request leaves the section without its photos instead of breaking the whole homepage.
async function loadStoryCards(): Promise<PublicSpotlight[]> {
  try {
    return (await fetchPublicSpotlight("story")).data;
  } catch {
    return [];
  }
}

export async function DiningStory() {
  const [firstDish, secondDish] = await loadStoryCards();

  return (
    <Section tone="ink" className="pt-0 md:pt-0 lg:pt-0">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        {firstDish || secondDish ? (
          <Reveal className="grid grid-cols-2 gap-4">
            {firstDish ? (
              <CaptionedImage
                src={firstDish.imageUrl ? toGalleryAssetUrl(firstDish.imageUrl) : undefined}
                alt={firstDish.alt?.trim() || firstDish.title}
                title={firstDish.title}
                tag={firstDish.tag ?? undefined}
                badge={firstDish.badge ?? undefined}
                aspect="aspect-[4/5]"
              />
            ) : null}
            {secondDish ? (
              <CaptionedImage
                src={secondDish.imageUrl ? toGalleryAssetUrl(secondDish.imageUrl) : undefined}
                alt={secondDish.alt?.trim() || secondDish.title}
                title={secondDish.title}
                tag={secondDish.tag ?? undefined}
                badge={secondDish.badge ?? undefined}
                aspect="aspect-[3/5]"
                className="mt-12"
              />
            ) : null}
          </Reveal>
        ) : null}

        {/* Always the right column, so the text doesn't jump left when the photos are missing. */}
        <Reveal className="max-w-xl lg:col-start-2">
          <Heading eyebrow="The island city-state's culinary scene">
            Diverse dining experiences, <em>one chef&rsquo;s point of view.</em>
          </Heading>
          <p className="mt-6 text-lg text-muted-foreground">
            Our curation reflects the occasions Singapore dines for — an intimate anniversary,
            a family gathering, a themed evening, a board dinner. Flavours travel from
            progressive Asian to Modern Indian, with molecular technique and wine pairing
            where it earns its place.
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            Several dishes on our menus were invented in this kitchen and are not available
            commercially anywhere else.
          </p>
          <TextLink href="/chef" className="mt-6">
            Meet Chef Ashish
          </TextLink>
        </Reveal>
      </div>
    </Section>
  );
}
