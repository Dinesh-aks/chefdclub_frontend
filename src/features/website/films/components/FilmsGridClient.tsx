"use client";

import { useState } from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Pagination } from "@/components/shared/Pagination";
import { StaggerGroup } from "@/components/shared/StaggerGroup";
import { StaggerItem } from "@/components/shared/StaggerItem";
import { FilmCard } from "@/features/website/films/components/FilmCard";
import type { Film, FilmCategory } from "@/lib/api/films";

interface FilmsGridClientProps {
  /** Already just this page's videos. */
  videos: Film[];
  category: FilmCategory;
  page: number;
  totalPages: number;
}

/** Adds autoplay (and inline playback) to a YouTube embed URL. */
function withAutoplay(embedUrl: string | null): string | undefined {
  if (!embedUrl) return undefined;
  try {
    const url = new URL(embedUrl);
    url.searchParams.set("autoplay", "1");
    url.searchParams.set("playsinline", "1");
    return url.toString();
  } catch {
    return embedUrl;
  }
}

export function FilmsGridClient({ videos, category, page, totalPages }: FilmsGridClientProps) {
  const [selectedVideo, setSelectedVideo] = useState<Film | null>(null);

  return (
    <>
      <StaggerGroup className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {videos.map((video, index) => (
          <StaggerItem key={video.id}>
            <FilmCard video={video} priority={index === 0} onSelect={() => setSelectedVideo(video)} />
          </StaggerItem>
        ))}
      </StaggerGroup>

      <Pagination
        page={page}
        totalPages={totalPages}
        hrefBase={{ path: "/films", params: { category: category === "all" ? undefined : category } }}
      />

      <Dialog
        open={selectedVideo !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedVideo(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-black/90"
          className="w-auto gap-0 border-none bg-transparent p-0 shadow-none sm:max-w-none"
        >
          <DialogTitle className="sr-only">Film player</DialogTitle>
          <DialogClose
            aria-label="Close video"
            className="absolute -top-11 right-0 flex size-9 sm:top-0 sm:-right-12 items-center justify-center rounded-full bg-white/90 text-black transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            <XIcon className="size-5" aria-hidden="true" />
          </DialogClose>
          {selectedVideo ? (
            <div className="mx-auto aspect-[9/16] h-[84vh] max-w-[92vw] overflow-hidden rounded-md bg-black">
              <iframe
                key={selectedVideo.id}
                src={withAutoplay(selectedVideo.embedUrl)}
                title={`Film ${selectedVideo.id}`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
