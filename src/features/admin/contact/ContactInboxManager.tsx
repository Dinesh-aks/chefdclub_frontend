"use client";

import { useMemo, useState } from "react";
import { ApiError } from "@/lib/api/core/client";
import { fetchAdminContactMessages } from "@/lib/api/contact";
import { DataTable } from "@/components/admin/data-table/DataTable";
import { InkDots } from "@/components/shared/InkDots";
import { useServerAdminTable } from "@/hooks/useServerAdminTable";
import { createContactInboxTableColumns } from "@/features/admin/contact/components/contactInboxTableColumns";
import { ContactMessageDialog } from "@/features/admin/contact/components/ContactMessageDialog";

export function ContactInboxManager() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { items: messages, loading, loadError, total, server, setLoadError } = useServerAdminTable({
    fetchPage: async (params) => {
      try {
        const response = await fetchAdminContactMessages(params);
        return response.data;
      } catch (err) {
        setLoadError(err instanceof ApiError ? err.message : "Could not load messages.");
        throw err;
      }
    },
    defaultSortField: "id",
    defaultOrder: "desc",
  });

  const columns = useMemo(
    () => createContactInboxTableColumns({ onViewMessage: (message) => setSelectedId(message.id) }),
    [],
  );

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg font-semibold">Contact Inbox</h1>
        <p className="text-muted-foreground">
          {total.toLocaleString()} messages submitted through the website&rsquo;s contact form.
        </p>
      </div>

      {loadError ? <p className="text-sm text-destructive">{loadError}</p> : null}

      {loading ? (
        <InkDots label="Loading messages" />
      ) : (
        <DataTable
          columns={columns}
          data={messages ?? []}
          searchPlaceholder="Search messages…"
          emptyMessage="No messages match your search."
          server={server}
        />
      )}

      <ContactMessageDialog
        messageId={selectedId}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      />
    </div>
  );
}
