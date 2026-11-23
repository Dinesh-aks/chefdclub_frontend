"use client";

import { type ColumnDef } from "@tanstack/react-table";
import {
  AdminTableActions,
  AdminTableDeleteButton,
  AdminTableEditButton,
} from "@/components/admin/AdminTableActionButtons";

export function createEditDeleteActionsColumn<T extends { id: number }>({
  deletingId,
  onEdit,
  onDelete,
}: {
  deletingId: number | null;
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
}): ColumnDef<T> {
  return {
    id: "actions",
    header: () => <span className="block text-right">Action</span>,
    enableSorting: false,
    enableGlobalFilter: false,
    cell: (info) => {
      const row = info.row.original;
      return (
        <AdminTableActions>
          <AdminTableEditButton onClick={() => onEdit(row)} />
          <AdminTableDeleteButton
            disabled={deletingId === row.id}
            onClick={() => void onDelete(row)}
          />
        </AdminTableActions>
      );
    },
  };
}
