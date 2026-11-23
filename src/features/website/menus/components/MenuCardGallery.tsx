"use client";

import { useState, type ComponentProps } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon, ZoomInIcon } from "lucide-react";
import { Pagination } from "@/components/shared/Pagination";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export interface MenuGalleryCard {
  id: number;
  name: string;
  /** Meal type, e.g. "Dinner". */
  typeLabel: string;
  /** Absolute image URL; null when the card has no photo. */
  src: string | null;
}

/** One meal type's page of cards, with what its own pagination needs. */
export interface MenuGallerySection {
  /** Meal type slug, e.g. "dinner"; also the id the section's pager jumps back to. */
  slug: string;
  label: string;
  /** All cards of this meal type (not just this page). */
  total: number;
  cards: MenuGalleryCard[];
  page: number;
  totalPages: number;
  /** Where this section's pager links go (plain data, so a Server Component can pass it). */
  hrefBase: ComponentProps<typeof Pagination>["hrefBase"];
}

interface MenuCardGalleryProps {
  sections: MenuGallerySection[];
}

/**
 * The menus of one category, one section per meal type, each with its own pager. Each card is a
 * photo of a printed menu, so it is shown at its natural portrait shape with no overlay text;
 * clicking opens it large enough to read, with previous/next across the cards on screen. Which
 * cards each section gets (and its page) is decided by the server.
 */
export function MenuCardGallery({ sections }: MenuCardGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Lightbox order = the order the cards appear on screen.
  const ordered = sections.flatMap((section) => section.cards);
  const current = openIndex === null ? null : ordered[openIndex];

  function step(delta: number) {
    setOpenIndex((index) =>
      index === null ? null : (index + delta + ordered.length) % ordered.length,
    );
  }

  if (!ordered.length) {
    return <p className="mt-12 text-muted-foreground">Menu details will be added soon.</p>;
  }

  return (
    <>
      <div className="mt-10 space-y-14">
        {sections.map((section) => (
          <section
            key={section.slug}
            id={`menu-${section.slug}`}
            aria-label={section.label}
            className="scroll-mt-32"
          >
            <h3 className="flex items-center gap-4 text-xs tracking-mega text-primary uppercase">
              {section.label}
              <span className="text-muted-foreground">{section.total}</span>
              <span className="h-px flex-1 bg-border" aria-hidden="true" />
            </h3>
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
              {section.cards.map((card) => (
                <li key={card.id}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(ordered.indexOf(card))}
                    className="group block w-full text-left focus-visible:outline-none"
                    aria-label={`View ${card.name}`}
                  >
                    <span className="relative block aspect-[5/7] overflow-hidden rounded-sm border border-border bg-muted shadow-sm transition-shadow duration-300 group-hover:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-ring">
                      {card.src ? (
                        <Image
                          src={card.src}
                          alt={card.name}
                          fill
                          sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 46vw"
                          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        />
                      ) : null}
                      <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100 group-focus-visible:bg-black/30 group-focus-visible:opacity-100">
                        <ZoomInIcon className="size-6 text-white" aria-hidden="true" />
                      </span>
                    </span>
                    <span className="mt-3 block text-sm leading-snug text-muted-foreground transition-colors group-hover:text-foreground">
                      {card.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <Pagination
              page={section.page}
              totalPages={section.totalPages}
              hrefBase={section.hrefBase}
              className="mt-8"
            />
          </section>
        ))}
      </div>

      <Dialog open={current !== null && current !== undefined} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <DialogContent
          className="tone-ink flex w-fit max-w-[min(96vw,52rem)] flex-col gap-0 overflow-hidden border-foreground/15 bg-card p-0 sm:max-w-[min(96vw,52rem)]"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") step(-1);
            if (event.key === "ArrowRight") step(1);
          }}
        >
          <DialogTitle className="sr-only">{current?.name ?? "Menu"}</DialogTitle>
          {current ? (
            <>
              <div className="relative flex max-h-[82vh] items-center justify-center bg-black/40">
                {current.src ? (
                  <Image
                    src={current.src}
                    alt={current.name}
                    width={1400}
                    height={1900}
                    sizes="(min-width: 832px) 52rem, 96vw"
                    className="h-auto max-h-[82vh] w-auto max-w-full object-contain"
                  />
                ) : null}
                {ordered.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label="Previous menu"
                      className="absolute top-1/2 left-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/80"
                    >
                      <ChevronLeftIcon className="size-5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label="Next menu"
                      className="absolute top-1/2 right-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/80"
                    >
                      <ChevronRightIcon className="size-5" aria-hidden="true" />
                    </button>
                  </>
                ) : null}
              </div>
              <div className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                <span className="min-w-0 truncate text-foreground">{current.name}</span>
                <span className="shrink-0 text-xs tracking-mega text-muted-foreground uppercase">
                  {current.typeLabel} · {(openIndex ?? 0) + 1}/{ordered.length}
                </span>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
