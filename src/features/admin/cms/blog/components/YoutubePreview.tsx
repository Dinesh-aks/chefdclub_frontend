"use client";

import { useState } from "react";
import { PlayIcon, VideoIcon } from "lucide-react";

// A bare 11-character id, or the id inside a watch / youtu.be / embed / shorts link.
const BARE_ID = /^[A-Za-z0-9_-]{11}$/;
const LINK_ID =
  /(?:youtube\.com\/(?:watch\?(?:[^"'\s]*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

function youtubeIdFrom(value: string): string | null {
  const text = value.trim();
  return BARE_ID.test(text) ? text : (LINK_ID.exec(text)?.[1] ?? null);
}

/** Video box beside the "Post video" field: thumbnail you can click to play, or a placeholder. */
export function YoutubePreview({ value }: { value: string }) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const id = youtubeIdFrom(value);
  // Nothing typed yet: no box at all, the field simply stays on its own.
  if (value.trim() === "") return null;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
      {id ? (
        playingId === id ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
            title="Video preview"
            className="size-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlayingId(id)}
            className="group absolute inset-0 size-full"
            aria-label="Play video preview"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- external thumbnail host */}
            <img
              src={`https://i3.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt="Video thumbnail"
              className="size-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
              <span className="flex size-12 items-center justify-center rounded-full bg-red-600 text-white shadow-md">
                <PlayIcon className="size-5 fill-current" aria-hidden="true" />
              </span>
            </span>
          </button>
        )
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-2 border border-dashed border-input bg-muted/30 px-4 text-center text-muted-foreground">
          <VideoIcon className="size-8" aria-hidden="true" />
          <span className="text-xs">That doesn&rsquo;t look like a YouTube video ID (11 characters)</span>
        </div>
      )}
    </div>
  );
}
