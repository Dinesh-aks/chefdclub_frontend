"use client";

import Image from "next/image";
import { type ColumnDef } from "@tanstack/react-table";
import {
  AdminTableActions,
  AdminTableDeleteButton,
  AdminTableEditButton,
} from "@/components/admin/AdminTableActionButtons";
import { CmsStatusBadge } from "@/components/admin/CmsStatusBadge";
import { toGalleryAssetUrl } from "@/lib/api/gallery";
import { SPOTLIGHT_PLACEMENT_LABELS, type SpotlightRecord } from "@/lib/api/spotlight";

export function createSpotlightTableColumns({
  deletingId,
  onEdit,
  onDelete,
}: {
  deletingId: number | null;
  onEdit: (card: SpotlightRecord) => void;
  onDelete: (card: SpotlightRecord) => void;
}): ColumnDef<SpotlightRecord>[] {
  return [
    {
      id: "thumbnail",
      header: () => <span className="sr-only">Preview</span>,
      enableSorting: false,
      enableGlobalFilter: false,
      cell: (info) => {
        const card = info.row.original;
        return card.imageUrl ? (
          <div className="relative h-12 w-16 overflow-hidden rounded-md border border-border bg-muted">
            <Image
              src={toGalleryAssetUrl(card.imageUrl)}
              alt={card.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        ) : (
          <div className="h-12 w-16 rounded-md border border-border bg-muted" />
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: (info) =>
        info.getValue<string>() || <span className="text-muted-foreground">No title</span>,
    },
    {
      id: "placement",
      accessorFn: (card) => SPOTLIGHT_PLACEMENT_LABELS[card.placement],
      header: "Where it shows",
    },
    { id: "tag", accessorFn: (card) => card.tag ?? "—", header: "Tag" },
    { id: "badge", accessorFn: (card) => card.badge ?? "—", header: "Badge" },
    {
      id: "status",
      accessorFn: (card) => (card.status ? "Active" : "Inactive"),
      header: "Status",
      cell: (info) => <CmsStatusBadge active={info.row.original.status} />,
    },
    { accessorKey: "sort", header: "Order" },
    {
      id: "actions",
      header: () => <span className="block text-right">Action</span>,
      enableSorting: false,
      enableGlobalFilter: false,
      cell: (info) => (
        <AdminTableActions>
          <AdminTableEditButton onClick={() => onEdit(info.row.original)} />
          <AdminTableDeleteButton
            disabled={deletingId === info.row.original.id}
            onClick={() => onDelete(info.row.original)}
          />
        </AdminTableActions>
      ),
    },
  ];
}
