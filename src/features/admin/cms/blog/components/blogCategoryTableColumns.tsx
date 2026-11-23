"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { CmsStatusBadge } from "@/components/admin/CmsStatusBadge";
import { createEditDeleteActionsColumn } from "@/components/admin/createEditDeleteActionsColumn";
import type { BlogCategoryRecord } from "@/lib/api/blog";

export function createBlogCategoryTableColumns({
  deletingId,
  onEdit,
  onDelete,
}: {
  deletingId: number | null;
  onEdit: (category: BlogCategoryRecord) => void;
  onDelete: (category: BlogCategoryRecord) => void;
}): ColumnDef<BlogCategoryRecord>[] {
  return [
    { accessorKey: "category", header: "Category" },
    { accessorKey: "slug", header: "Slug" },
    {
      id: "status",
      accessorFn: (category) => (category.status ? "Active" : "Inactive"),
      header: "Status",
      cell: (info) => <CmsStatusBadge active={info.row.original.status} />,
    },
    { accessorKey: "sort", header: "Order" },
    createEditDeleteActionsColumn({ deletingId, onEdit, onDelete }),
  ];
}
