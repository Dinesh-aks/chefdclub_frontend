"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { CMS_STATUS_LABELS, CmsStatusBadge } from "@/components/admin/CmsStatusBadge";
import { createEditDeleteActionsColumn } from "@/components/admin/createEditDeleteActionsColumn";
import type { MenuCardRecord } from "@/lib/api/menuCards";
import { formatBusinessDateTime } from "@/lib/formatDateTime";

export function createMenuCardTableColumns({
  deletingId,
  categoryName,
  onEdit,
  onDelete,
}: {
  deletingId: number | null;
  categoryName: (menu: number) => string;
  onEdit: (card: MenuCardRecord) => void;
  onDelete: (card: MenuCardRecord) => void;
}): ColumnDef<MenuCardRecord>[] {
  return [
    { accessorKey: "name", header: "Name" },
    {
      id: "menu",
      accessorFn: (card) => categoryName(card.menu),
      header: "Menu",
    },
    { accessorKey: "typeLabel", header: "Type" },
    {
      id: "status",
      accessorFn: (card) => (card.status ? "Active" : "Inactive"),
      header: "Status",
      cell: (info) => (
        <CmsStatusBadge active={info.row.original.status} labels={CMS_STATUS_LABELS.activeInactive} />
      ),
    },
    {
      id: "createdAt",
      accessorFn: (card) => (card.createdAt ? new Date(card.createdAt).getTime() : 0),
      header: "Created at",
      cell: (info) => (
        <span className="whitespace-nowrap tabular-nums text-muted-foreground">
          {formatBusinessDateTime(info.row.original.createdAt)}
        </span>
      ),
    },
    createEditDeleteActionsColumn({ deletingId, onEdit, onDelete }),
  ];
}
