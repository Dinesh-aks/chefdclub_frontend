import Image from "next/image";
import { cn } from "@/lib/utils";

interface CaptionedImageProps {
  /** Omit while real photography isn't available yet — renders a placeholder. */
  src?: string;
  alt: string;
  title?: string;
  tag?: string;
  /** Small tracked label pinned to the top-left corner, e.g. "Spotlight". */
  badge?: string;
  aspect?: string;
  className?: string;
  priority?: boolean;
  /** Extra classes for the `<Image>` itself, e.g. a slight `scale-*` to crop out an edge artifact in a source photo. */
  imageClassName?: string;
  /** Show the caption only while hovering (mouse devices). Touch devices have no hover, so they always show it. */
  captionOnHover?: boolean;
}

/**
 * The photo-with-bottom-left-caption pattern used across Home/Gallery/Journal
 * (dish name + category tag over a dark tint across the whole photo, no blur).
 * See docs/ARCHITECTURE.md
 * §20 — when there's no `src` yet, renders a neutral placeholder in the same
 * aspect ratio so layouts don't shift once real photography is added.
 */
export function CaptionedImage({
  src,
  alt,
  title,
  tag,
  badge,
  aspect = "aspect-[4/5]",
  className,
  priority,
  imageClassName,
  captionOnHover = false,
}: CaptionedImageProps) {
  return (
    <figure
      className={cn(
        "group relative overflow-hidden rounded-md border border-white/15 bg-muted",
        aspect,
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={cn(
            "object-cover transition-transform duration-500 ease-out group-hover:scale-105",
            imageClassName,
          )}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-secondary via-muted to-secondary"
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "absolute inset-0 bg-black/10",
          captionOnHover &&
            "pointer-fine:bg-black/0 pointer-fine:transition-colors pointer-fine:duration-300 pointer-fine:group-hover:bg-black/10 motion-reduce:transition-none",
        )}
        aria-hidden="true"
      />

      {/* Only the edge behind the text is darkened, so the caption reads without dimming the whole photo. */}
      {title || tag ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/65 to-transparent",
            captionOnHover &&
              "opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-coarse:opacity-100 motion-reduce:transition-none",
          )}
          aria-hidden="true"
        />
      ) : null}
      {badge ? (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1/5 bg-gradient-to-b from-black/45 to-transparent"
          aria-hidden="true"
        />
      ) : null}

      <div
        className="pointer-events-none absolute inset-3 border border-white/25"
        aria-hidden="true"
      />

      {badge ? (
        <p className="absolute top-0 left-0 py-4 pr-4 pl-6 text-sm tracking-mega text-white/80 uppercase">
          {badge}
        </p>
      ) : null}

      {(title || tag) && (
        <figcaption
          className={cn(
            "absolute inset-x-0 bottom-0 py-4 pr-4 pl-6 text-white",
            captionOnHover &&
              "pointer-fine:translate-y-2 pointer-fine:opacity-0 pointer-fine:transition-[opacity,transform] pointer-fine:duration-300 pointer-fine:group-hover:translate-y-0 pointer-fine:group-hover:opacity-100 motion-reduce:transition-none",
          )}
        >
          {title ? (
            <p className="font-serif text-xl leading-snug sm:text-2xl">
              {title}
            </p>
          ) : null}
          {tag ? (
            <p className="mt-1.5 text-sm tracking-mega text-white/70 uppercase">
              {tag}
            </p>
          ) : null}
        </figcaption>
      )}
    </figure>
  );
}
