import { CaptionedImage } from "@/components/shared/CaptionedImage";
import { Heading } from "@/components/shared/Heading";
import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { StaggerGroup } from "@/components/shared/StaggerGroup";
import { StaggerItem } from "@/components/shared/StaggerItem";
import { TextLink } from "@/components/shared/TextLink";
import { galleryHighlights } from "@/features/website/home/data";

export function GalleryHighlights() {
  return (
    <Section tone="ink">
      <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <Heading eyebrow="Signatures">From the gallery</Heading>
        <TextLink href="/gallery">See the full gallery</TextLink>
      </Reveal>

      <StaggerGroup className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {galleryHighlights.map((dish, index) => (
          <StaggerItem key={dish.title}>
            <CaptionedImage
              src={dish.src}
              alt={dish.title}
              title={dish.title}
              tag={dish.tag}
              aspect="aspect-square"
              priority={index === 0}
              imageClassName={
                dish.title === "Pan-fried salmon, lemon butter"
                  ? "scale-110 group-hover:scale-115"
                  : undefined
              }
            />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}
