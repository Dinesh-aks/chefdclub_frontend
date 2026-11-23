"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, PlayIcon, VideoIcon } from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/core/client";
import {
  createAdminGalleryVideo,
  fetchAdminGalleryVideo,
  updateAdminGalleryVideo,
  type GalleryVideoCategory,
} from "@/lib/api/gallery";
import { FormActions } from "@/components/admin/FormActions";
import { FormSection } from "@/components/admin/FormSection";
import { InkDots } from "@/components/shared/InkDots";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  GALLERY_VIDEO_CATEGORIES,
  GALLERY_VIDEO_CATEGORY_LABELS,
} from "@/features/admin/cms/gallery/galleryVideoConstants";

// Pulls the video id out of a watch link, a youtu.be link, or an <iframe> embed code.
const YOUTUBE_ID_PATTERN =
  /(?:youtube\.com\/(?:watch\?(?:[^"'\s]*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

function youtubeIdFrom(source: string): string | null {
  return YOUTUBE_ID_PATTERN.exec(source)?.[1] ?? null;
}

interface GalleryVideoFormProps {
  /** Set to edit an existing video; leave out to add a new one. */
  videoId?: number;
}

export function GalleryVideoForm({ videoId: editId }: GalleryVideoFormProps) {
  const router = useRouter();
  const editing = editId !== undefined;
  const [category, setCategory] = useState<GalleryVideoCategory>("veg");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(editing);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  // Which video is playing in the preview; a different link goes back to its thumbnail.
  const [playingId, setPlayingId] = useState<string | null>(null);

  const videoId = youtubeIdFrom(source);

  useEffect(() => {
    if (!editing) return;

    let cancelled = false;

    async function load() {
      try {
        const { data } = await fetchAdminGalleryVideo(editId!);
        if (cancelled) return;
        setCategory(data.category);
        setSource(data.source);
        setLoadError("");
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err instanceof ApiError
              ? err.message
              : "Could not load this video.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [editId, editing]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    if (!source.trim()) {
      const message = "Paste a YouTube link or embed code.";
      setFormError(message);
      toast.error(message);
      return;
    }

    setSubmitting(true);
    try {
      if (editing) {
        await updateAdminGalleryVideo(editId, {
          category,
          source: source.trim(),
        });
        toast.success("Video saved");
      } else {
        await createAdminGalleryVideo({ category, source: source.trim() });
        toast.success("Video added");
      }
      router.push("/admin/cms/gallery/videos");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Could not save this video.";
      toast.error(message);
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <header className="mb-5 space-y-3">
        <Link
          href="/admin/cms/gallery/videos"
          className="inline-flex items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeftIcon className="size-4 shrink-0" aria-hidden="true" />
          Gallery Videos
        </Link>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            {editing ? "Edit Video" : "Add Video"}
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {editing
              ? "Update this video on the Films page"
              : "Add a video link to the Films page"}
          </p>
        </div>
      </header>

      {loading ? (
        <InkDots label="Loading" />
      ) : (
        <form onSubmit={handleSubmit}>
          {loadError ? (
            <p className="mb-4 text-sm text-destructive">{loadError}</p>
          ) : null}

          {/* Few fields, so one roomy card: a live preview on the left, the details beside it. */}
          <div className="grid grid-cols-1 gap-8 rounded-lg border border-border bg-card p-6 shadow-sm lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-10">
            <FormSection
              title="Preview"
              description="Shown once a YouTube link is pasted."
            >
              <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-input bg-muted/30">
                {videoId && playingId === videoId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1`}
                    title="Video preview"
                    className="size-full"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                ) : videoId ? (
                  <button
                    type="button"
                    onClick={() => setPlayingId(videoId)}
                    className="group absolute inset-0 size-full"
                    aria-label="Play video preview"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- external thumbnail host */}
                    <img
                      src={`https://i3.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                      alt="Video thumbnail"
                      className="size-full object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                      <span className="flex size-12 items-center justify-center rounded-full bg-red-600 text-white shadow-md">
                        <PlayIcon className="size-5 fill-current" aria-hidden="true" />
                      </span>
                    </span>
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-2 px-4 text-center text-muted-foreground">
                    <VideoIcon className="size-9" aria-hidden="true" />
                    <span className="text-sm">
                      {source.trim()
                        ? "No YouTube video found in this text"
                        : "No video yet"}
                    </span>
                  </div>
                )}
              </div>
            </FormSection>

            <div className="lg:border-l lg:border-border lg:pl-10">
              <FormSection
                title="Video Details"
                description="The category it appears under and the video's YouTube link or embed code."
              >
                <div className="grid gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="video-category" required>
                      Category
                    </Label>
                    <Select
                      value={category}
                      onValueChange={(value) =>
                        setCategory(value as GalleryVideoCategory)
                      }
                    >
                      <SelectTrigger id="video-category" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GALLERY_VIDEO_CATEGORIES.map((value) => (
                          <SelectItem key={value} value={value}>
                            {GALLERY_VIDEO_CATEGORY_LABELS[value]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="video-source" required>
                      YouTube link or embed code
                    </Label>
                    <Textarea
                      id="video-source"
                      rows={5}
                      value={source}
                      onChange={(event) => setSource(event.target.value)}
                      placeholder="https://www.youtube.com/watch?v=…"
                    />
                  </div>
                </div>
              </FormSection>
            </div>
          </div>

          <FormActions error={formError}>
            <Button
              type="button"
              variant="outline"
              asChild
              className="sm:min-w-[5.5rem]"
            >
              <Link href="/admin/cms/gallery/videos">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={submitting || Boolean(loadError)}
              className="sm:min-w-[5.5rem]"
            >
              {submitting ? "Saving…" : editing ? "Save video" : "Add video"}
            </Button>
          </FormActions>
        </form>
      )}
    </div>
  );
}
