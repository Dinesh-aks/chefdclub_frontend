import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaptionedImage } from "@/components/shared/CaptionedImage";
import { Heading } from "@/components/shared/Heading";
import { Section } from "@/components/shared/Section";
import { TextLink } from "@/components/shared/TextLink";
import { reserveNavItem } from "@/config/nav";
import { heroStats, pressLogos } from "@/features/website/home/data";
import { toGalleryAssetUrl } from "@/lib/api/gallery";
import { fetchPublicSpotlight, type PublicSpotlight } from "@/lib/api/spotlight";

// A failed request leaves the hero without photo cards instead of breaking the whole homepage.
async function loadSpotlight(): Promise<PublicSpotlight[]> {
  try {
    return (await fetchPublicSpotlight("hero")).data;
  } catch {
    return [];
  }
}

export async function Hero() {
  const spotlight = await loadSpotlight();

  return (
    <Section
      tone="ink"
      className="relative overflow-hidden pt-8 pb-0 md:pt-12 lg:pt-16"
    >
      <div
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-full max-w-3xl bg-[radial-gradient(ellipse_at_top_right,color-mix(in_oklab,var(--primary)_35%,transparent),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div>
          <Heading as="h1" size="display" eyebrow="Curated dining · Singapore">
            Where experience is an expectation,{" "}
            <em>and great food is a given</em> —{" "}
            <em className="text-primary">with a hint of opulence.</em>
          </Heading>
          <p className="mt-6 max-w-xl text-muted-foreground">
            Chef Ashish Poddar brings progressive Asian, Modern Indian and European fusion to
            your table: multi-course private dinners at his Keppel Bay home, or at yours.
            Weekends only. Every menu written for the occasion.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Button asChild size="lg" className="group h-14 px-8 text-xs">
              <Link href={reserveNavItem.href}>
                {reserveNavItem.label}
                <ArrowRightIcon
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </Button>
            <TextLink href="/menus">Explore the menus</TextLink>
          </div>
        </div>

        {spotlight.length ? (
          <div className="flex flex-col gap-4 self-start sm:max-w-md lg:max-w-none">
            {spotlight.map((card, index) => (
              <CaptionedImage
                key={card.id}
                src={card.imageUrl ? toGalleryAssetUrl(card.imageUrl) : undefined}
                alt={card.alt?.trim() || card.title}
                title={card.title}
                tag={card.tag ?? undefined}
                badge={card.badge ?? undefined}
                aspect="aspect-[16/9] lg:aspect-[16/11]"
                priority={index === 0}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-16 grid gap-6 border-t border-border py-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
        {heroStats.map((stat) => (
          <div key={stat.label} className="px-4 text-center first:pl-0 last:pr-0">
            <p className="font-serif text-2xl">{stat.value}</p>
            <p className="mt-1 text-xs tracking-mega text-muted-foreground uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 border-t border-b border-border py-10 sm:gap-6">
        {pressLogos.map((logo) => (
          <div
            key={logo.name}
            className="flex h-28 w-48 items-center justify-center rounded-lg bg-white p-3 sm:h-32 sm:w-56"
          >
            <Image
              src={logo.src}
              alt={logo.name}
              width={logo.width}
              height={logo.height}
              className="h-full w-full object-contain"
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
