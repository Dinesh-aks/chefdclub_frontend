"use client";

import { type ColumnDef } from "@tanstack/react-table";
import type { ContactMessageListItem } from "@/lib/api/contact";
import { Button } from "@/components/ui/button";

export function createContactInboxTableColumns({
  onViewMessage,
}: {
  onViewMessage: (message: ContactMessageListItem) => void;
}): ColumnDef<ContactMessageListItem>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => <span className="font-medium">{info.getValue<string>()}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => (
        <span className="block max-w-[220px] truncate text-muted-foreground">
          {info.getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "mobile",
      header: "Mobile",
      cell: (info) => (
        <span className="tabular-nums">{info.row.original.mobile?.trim() || "—"}</span>
      ),
    },
    {
      id: "message",
      header: "Message",
      enableSorting: false,
      enableGlobalFilter: false,
      cell: (info) => (
        <Button type="button" size="sm" onClick={() => onViewMessage(info.row.original)}>
          View message
        </Button>
      ),
    },
  ];
}
