"use client";

import { useState } from "react";
import Image from "next/image";
import { FilmIcon, PlayIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Film, FilmCategory } from "@/lib/api/films";

const CATEGORY_LABEL: Record<FilmCategory, string> = {
  all: "All",
  veg: "Vegetarian",
  "non-veg": "Non Vegetarian",
  "private-dining": "Private Dining",
};

interface FilmCardProps {
  video: Film;
  onSelect: () => void;
  priority?: boolean;
  className?: string;
}

export function FilmCard({ video, onSelect, priority, className }: FilmCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative block aspect-video w-full overflow-hidden rounded-md border border-white/15 bg-muted text-left",
        className,
      )}
    >
      {video.thumbnailUrl && !imageFailed ? (
        <Image
          src={video.thumbnailUrl}
          alt={`${CATEGORY_LABEL[video.category]} film`}
          fill
          priority={priority}
          onError={() => setImageFailed(true)}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      ) : (
        // No thumbnail (or it did not load): a dark card with a film icon and a label.
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 pb-10 text-white/60"
          aria-hidden="true"
        >
          <FilmIcon className="size-10" strokeWidth={1.25} />
          <span className="text-xs tracking-mega uppercase">Chef&rsquo;d Film</span>
        </div>
      )}

      <div className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/35" aria-hidden="true" />

      <div
        className="pointer-events-none absolute inset-3 border border-white/25"
        aria-hidden="true"
      />

      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-white/90 text-foreground transition-transform group-hover:scale-110">
          <PlayIcon className="ml-0.5 size-5" fill="currentColor" aria-hidden="true" />
        </span>
      </span>

      <p className="absolute inset-x-0 bottom-0 py-4 pr-4 pl-6 text-sm tracking-mega text-white uppercase">
        {CATEGORY_LABEL[video.category]}
      </p>
    </button>
  );
}
