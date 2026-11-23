"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { createEditDeleteActionsColumn } from "@/components/admin/createEditDeleteActionsColumn";
import type { SocialLinkRecord } from "@/lib/api/socialLinks";

export function createSocialLinkTableColumns({
  deletingId,
  onEdit,
  onDelete,
}: {
  deletingId: number | null;
  onEdit: (link: SocialLinkRecord) => void;
  onDelete: (link: SocialLinkRecord) => void;
}): ColumnDef<SocialLinkRecord>[] {
  return [
    { accessorKey: "link", header: "Link" },
    createEditDeleteActionsColumn({ deletingId, onEdit, onDelete }),
  ];
}
