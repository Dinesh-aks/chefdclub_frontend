"use client";

import Image from "next/image";
import { type ColumnDef } from "@tanstack/react-table";
import { createEditDeleteActionsColumn } from "@/components/admin/createEditDeleteActionsColumn";
import { toGalleryAssetUrl, type GalleryPhotoRecord } from "@/lib/api/gallery";
import { GALLERY_PHOTO_CATEGORY_LABELS } from "@/features/admin/cms/gallery/galleryPhotoConstants";

export function createGalleryPhotoTableColumns({
  deletingId,
  onEdit,
  onDelete,
}: {
  deletingId: number | null;
  onEdit: (photo: GalleryPhotoRecord) => void;
  onDelete: (photo: GalleryPhotoRecord) => void;
}): ColumnDef<GalleryPhotoRecord>[] {
  return [
    {
      id: "thumbnail",
      header: () => <span className="sr-only">Preview</span>,
      enableSorting: false,
      enableGlobalFilter: false,
      cell: (info) => {
        const photo = info.row.original;
        return (
          <div className="relative size-12 overflow-hidden rounded-md border border-border bg-muted">
            <Image
              src={toGalleryAssetUrl(photo.imageUrl)}
              alt={photo.name ?? "Gallery photo"}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        );
      },
    },
    {
      id: "name",
      accessorFn: (photo) => photo.name ?? "Untitled",
      header: "Name",
    },
    {
      id: "category",
      accessorFn: (photo) => GALLERY_PHOTO_CATEGORY_LABELS[photo.category],
      header: "Category",
    },
    createEditDeleteActionsColumn({ deletingId, onEdit, onDelete }),
  ];
}
