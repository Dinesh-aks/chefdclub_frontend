"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { CmsStatusBadge } from "@/components/admin/CmsStatusBadge";
import { createEditDeleteActionsColumn } from "@/components/admin/createEditDeleteActionsColumn";
import type { MenuCategoryRecord } from "@/lib/api/menuCategories";
import { formatBusinessDateTime } from "@/lib/formatDateTime";

export function createMenuCategoryTableColumns({
  deletingId,
  onEdit,
  onDelete,
}: {
  deletingId: number | null;
  onEdit: (category: MenuCategoryRecord) => void;
  onDelete: (category: MenuCategoryRecord) => void;
}): ColumnDef<MenuCategoryRecord>[] {
  return [
    { accessorKey: "name", header: "Name" },
    {
      id: "status",
      accessorFn: (category) => (category.status ? "Active" : "Inactive"),
      header: "Status",
      cell: (info) => <CmsStatusBadge active={info.row.original.status} />,
    },
    { accessorKey: "sort", header: "Order" },
    {
      id: "createdAt",
      accessorFn: (category) => category.createdAt ?? "",
      header: "Created at",
      cell: (info) => (
        <span className="whitespace-nowrap tabular-nums text-muted-foreground">
          {formatBusinessDateTime(info.row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "updatedAt",
      accessorFn: (category) => category.updatedAt ?? "",
      header: "Updated at",
      cell: (info) => (
        <span className="whitespace-nowrap tabular-nums text-muted-foreground">
          {formatBusinessDateTime(info.row.original.updatedAt)}
        </span>
      ),
    },
    createEditDeleteActionsColumn({ deletingId, onEdit, onDelete }),
  ];
}
