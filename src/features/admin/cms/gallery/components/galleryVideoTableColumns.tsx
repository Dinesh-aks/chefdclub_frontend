"use client";

import { type ColumnDef } from "@tanstack/react-table";
import {
  AdminTableActions,
  AdminTableDeleteButton,
  AdminTableEditButton,
} from "@/components/admin/AdminTableActionButtons";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GalleryVideoCategory, GalleryVideoRecord } from "@/lib/api/gallery";
import {
  GALLERY_VIDEO_CATEGORIES,
  GALLERY_VIDEO_CATEGORY_LABELS,
} from "@/features/admin/cms/gallery/galleryVideoConstants";

export function createGalleryVideoTableColumns({
  deletingId,
  updatingId,
  onPreview,
  onCategoryChange,
  onEdit,
  onDelete,
}: {
  deletingId: number | null;
  updatingId: number | null;
  onPreview: (video: GalleryVideoRecord) => void;
  onCategoryChange: (video: GalleryVideoRecord, category: GalleryVideoCategory) => void;
  onEdit: (video: GalleryVideoRecord) => void;
  onDelete: (video: GalleryVideoRecord) => void;
}): ColumnDef<GalleryVideoRecord>[] {
  return [
    {
      id: "preview",
      header: () => <span className="sr-only">Preview</span>,
      enableSorting: false,
      enableGlobalFilter: false,
      cell: (info) => {
        const video = info.row.original;
        return (
          <button
            type="button"
            onClick={() => onPreview(video)}
            disabled={!video.embedUrl}
            aria-label="Preview video"
            className="relative block size-12 overflow-hidden rounded-md border border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none enabled:cursor-pointer"
          >
            {video.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- external thumbnail host
              <img src={video.thumbnailUrl} alt="" className="size-full object-cover" />
            ) : (
              <span className="flex size-full items-center justify-center bg-muted text-[10px] text-muted-foreground uppercase">
                {video.platform}
              </span>
            )}
          </button>
        );
      },
    },
    {
      id: "category",
      accessorFn: (video) => GALLERY_VIDEO_CATEGORY_LABELS[video.category],
      header: "Category",
      cell: (info) => {
        const video = info.row.original;
        return (
          <Select
            value={video.category}
            disabled={updatingId === video.id}
            onValueChange={(value) => onCategoryChange(video, value as GalleryVideoCategory)}
          >
            <SelectTrigger size="sm" className="w-48" aria-label="Change category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GALLERY_VIDEO_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {GALLERY_VIDEO_CATEGORY_LABELS[category]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "platform",
      header: "Platform",
      cell: (info) => <Badge variant="secondary">{info.getValue<string>()}</Badge>,
    },
    {
      id: "actions",
      header: () => <span className="block text-right">Action</span>,
      enableSorting: false,
      enableGlobalFilter: false,
      cell: (info) => {
        const video = info.row.original;
        return (
          <AdminTableActions>
            <AdminTableEditButton onClick={() => onEdit(video)} />
            <AdminTableDeleteButton
              disabled={deletingId === video.id}
              onClick={() => void onDelete(video)}
            />
          </AdminTableActions>
        );
      },
    },
  ];
}
