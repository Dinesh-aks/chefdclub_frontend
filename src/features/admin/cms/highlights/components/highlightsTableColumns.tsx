"use client";

import Image from "next/image";
import { type ColumnDef } from "@tanstack/react-table";
import { CmsStatusBadge } from "@/components/admin/CmsStatusBadge";
import { createEditDeleteActionsColumn } from "@/components/admin/createEditDeleteActionsColumn";
import { toGalleryAssetUrl } from "@/lib/api/gallery";
import type { HighlightRecord } from "@/lib/api/highlights";

export function createHighlightsTableColumns({
  deletingId,
  onEdit,
  onDelete,
}: {
  deletingId: number | null;
  onEdit: (highlight: HighlightRecord) => void;
  onDelete: (highlight: HighlightRecord) => void;
}): ColumnDef<HighlightRecord>[] {
  return [
    {
      id: "thumbnail",
      header: () => <span className="sr-only">Preview</span>,
      enableSorting: false,
      enableGlobalFilter: false,
      cell: (info) => {
        const highlight = info.row.original;
        return highlight.imageUrl ? (
          <div className="relative size-12 overflow-hidden rounded-md border border-border bg-muted">
            <Image
              src={toGalleryAssetUrl(highlight.imageUrl)}
              alt={highlight.name ?? "Highlight"}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        ) : (
          <div className="size-12 rounded-md border border-border bg-muted" />
        );
      },
    },
    {
      id: "name",
      accessorFn: (highlight) => highlight.name ?? "Untitled",
      header: "Name",
    },
    {
      id: "status",
      accessorFn: (highlight) => (highlight.status ? "Active" : "Inactive"),
      header: "Status",
      cell: (info) => <CmsStatusBadge active={info.row.original.status} />,
    },
    { accessorKey: "sort", header: "Order" },
    createEditDeleteActionsColumn({ deletingId, onEdit, onDelete }),
  ];
}
