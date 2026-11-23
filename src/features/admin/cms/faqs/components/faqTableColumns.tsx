"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { CMS_STATUS_LABELS, CmsStatusBadge } from "@/components/admin/CmsStatusBadge";
import { createEditDeleteActionsColumn } from "@/components/admin/createEditDeleteActionsColumn";
import type { FaqListItem } from "@/lib/api/faq";
import { FAQ_CATEGORY_LABELS } from "@/features/admin/cms/faqs/faqConstants";

export function createFaqTableColumns({
  deletingId,
  onEdit,
  onDelete,
}: {
  deletingId: number | null;
  onEdit: (faq: FaqListItem) => void;
  onDelete: (faq: FaqListItem) => void;
}): ColumnDef<FaqListItem>[] {
  return [
    {
      accessorKey: "question",
      header: "Question",
      cell: (info) => (
        <span className="block max-w-md truncate whitespace-normal">{info.getValue<string>()}</span>
      ),
    },
    {
      id: "category",
      accessorFn: (faq) => FAQ_CATEGORY_LABELS[faq.category],
      header: "Category",
    },
    {
      accessorKey: "sort",
      header: "Order",
      cell: (info) => <span className="text-muted-foreground">{info.getValue<number>()}</span>,
    },
    {
      id: "status",
      accessorFn: (faq) => (faq.status ? "Active" : "Inactive"),
      header: "Status",
      cell: (info) => (
        <CmsStatusBadge active={info.row.original.status} labels={CMS_STATUS_LABELS.publishedHidden} />
      ),
    },
    createEditDeleteActionsColumn({ deletingId, onEdit, onDelete }),
  ];
}
