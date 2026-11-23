"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusIcon, XIcon } from "lucide-react";
import { ApiError } from "@/lib/api/core/client";
import {
  deleteAdminGalleryVideo,
  fetchAdminGalleryVideos,
  updateAdminGalleryVideo,
  type GalleryVideoCategory,
  type GalleryVideoRecord,
} from "@/lib/api/gallery";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AdminDataTable, type AdminDataTableHandle } from "@/components/admin/AdminDataTable";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { GalleryFilters } from "@/features/admin/cms/gallery/components/GalleryFilters";
import { createGalleryVideoTableColumns } from "@/features/admin/cms/gallery/components/galleryVideoTableColumns";
import {
  EMPTY_GALLERY_FILTERS,
  galleryFilterParams,
  type GalleryFilters as GalleryFiltersState,
} from "@/features/admin/cms/gallery/galleryFilters";
import {
  GALLERY_VIDEO_CATEGORIES,
  GALLERY_VIDEO_CATEGORY_LABELS,
} from "@/features/admin/cms/gallery/galleryVideoConstants";

const CATEGORY_OPTIONS = GALLERY_VIDEO_CATEGORIES.map((value) => ({
  value,
  label: GALLERY_VIDEO_CATEGORY_LABELS[value],
}));

/** Adds autoplay to a YouTube embed URL so the preview starts as soon as it opens. */
function withAutoplay(embedUrl: string): string {
  try {
    const url = new URL(embedUrl);
    url.searchParams.set("autoplay", "1");
    url.searchParams.set("playsinline", "1");
    return url.toString();
  } catch {
    return embedUrl;
  }
}

export function GalleryVideoManager() {
  const router = useRouter();
  const tableRef = useRef<AdminDataTableHandle>(null);
  const [filters, setFilters] = useState<GalleryFiltersState>(EMPTY_GALLERY_FILTERS);
  const [actionError, setActionError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [previewVideo, setPreviewVideo] = useState<GalleryVideoRecord | null>(null);

  const { confirm, confirmDialog } = useConfirm();

  async function handleDelete(video: GalleryVideoRecord) {
    if (!(await confirm("Delete this video?"))) {
      return;
    }
    setDeletingId(video.id);
    try {
      await deleteAdminGalleryVideo(video.id);
      await tableRef.current?.reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not delete this video.");
    } finally {
      setDeletingId(null);
    }
  }

  const handleCategoryChange = useCallback(
    async (video: GalleryVideoRecord, category: GalleryVideoCategory) => {
      if (category === video.category) return;
      setUpdatingId(video.id);
      setActionError("");
      try {
        await updateAdminGalleryVideo(video.id, { category });
        await tableRef.current?.reload();
      } catch (err) {
        setActionError(err instanceof ApiError ? err.message : "Could not change the category.");
      } finally {
        setUpdatingId(null);
      }
    },
    [],
  );

  const filterParams = useMemo(() => galleryFilterParams<GalleryVideoCategory>(filters), [filters]);

  const columns = useMemo(
    () =>
      createGalleryVideoTableColumns({
        deletingId,
        updatingId,
        onPreview: setPreviewVideo,
        onCategoryChange: (video, category) => void handleCategoryChange(video, category),
        onEdit: (video) => router.push(`/admin/cms/gallery/videos/${video.id}/edit`),
        onDelete: (video) => void handleDelete(video),
      }),
    [deletingId, updatingId, router, handleCategoryChange],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Gallery Videos</h1>
          <p className="mt-2 text-muted-foreground">
            Video links shown on the Films page.
          </p>
        </div>
        <Button type="button" asChild>
          <Link href="/admin/cms/gallery/videos/new">
            <PlusIcon className="size-4" aria-hidden="true" />
            Add Video
          </Link>
        </Button>
      </div>

      {actionError ? <p className="text-sm text-destructive">{actionError}</p> : null}

      <GalleryFilters
        idPrefix="filter-video"
        filters={filters}
        categories={CATEGORY_OPTIONS}
        onFilterChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
        onReset={() => setFilters(EMPTY_GALLERY_FILTERS)}
      />

      <AdminDataTable
        ref={tableRef}
        extraParams={filterParams}
        columns={columns}
        fetchPage={(params) => fetchAdminGalleryVideos(params).then((r) => r.data)}
        searchPlaceholder="Search videos…"
        emptyMessage="No videos match your search."
        defaultSortField="addDate"
        defaultOrder="desc"
        loadingLabel="Loading videos"
      />

      <Dialog
        open={previewVideo !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewVideo(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-black/90"
          className="w-auto gap-0 border-none bg-transparent p-0 shadow-none sm:max-w-none"
        >
          <DialogTitle className="sr-only">Video preview</DialogTitle>
          <DialogClose
            aria-label="Close video"
            className="absolute -top-11 right-0 flex size-9 sm:top-0 sm:-right-12 items-center justify-center rounded-full bg-white/90 text-black transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            <XIcon className="size-5" aria-hidden="true" />
          </DialogClose>
          {previewVideo?.embedUrl ? (
            <div className="mx-auto aspect-[9/16] h-[80vh] max-w-[92vw] overflow-hidden rounded-md bg-black">
              <iframe
                key={previewVideo.id}
                src={withAutoplay(previewVideo.embedUrl)}
                title={`Video ${previewVideo.id}`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {confirmDialog}
    </div>
  );
}
