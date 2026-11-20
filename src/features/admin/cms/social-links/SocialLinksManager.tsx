"use client";

import { useMemo, useRef, useState } from "react";
import { ApiError } from "@/lib/api/core/client";
import {
  deleteAdminSocialLink,
  fetchAdminSocialLinks,
  type SocialLinkRecord,
} from "@/lib/api/socialLinks";
import { AdminDataTable, type AdminDataTableHandle } from "@/components/admin/AdminDataTable";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { SocialLinkFormDialog } from "@/features/admin/cms/social-links/components/SocialLinkFormDialog";
import { createSocialLinkTableColumns } from "@/features/admin/cms/social-links/components/socialLinkTableColumns";

export function SocialLinksManager() {
  const tableRef = useRef<AdminDataTableHandle>(null);
  const [actionError, setActionError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SocialLinkRecord | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { confirm, confirmDialog } = useConfirm();

  async function handleDelete(link: SocialLinkRecord) {
    if (!(await confirm(`Delete the link to "${link.link}"?`))) {
      return;
    }
    setDeletingId(link.id);
    try {
      await deleteAdminSocialLink(link.id);
      await tableRef.current?.reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not delete this social link.");
    } finally {
      setDeletingId(null);
    }
  }

  const columns = useMemo(
    () =>
      createSocialLinkTableColumns({
        deletingId,
        onEdit: (link) => {
          setEditing(link);
          setDialogOpen(true);
        },
        onDelete: (link) => void handleDelete(link),
      }),
    [deletingId],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Social Links</h1>
          <p className="mt-2 text-muted-foreground">
            Links shown site-wide in the footer.
          </p>
        </div>
      </div>

      {actionError ? <p className="text-sm text-destructive">{actionError}</p> : null}

      <AdminDataTable
        ref={tableRef}
        columns={columns}
        fetchPage={(params) => fetchAdminSocialLinks(params).then((r) => r.data)}
        searchPlaceholder="Search links…"
        emptyMessage="No links match your search."
        defaultSortField="id"
        defaultOrder="asc"
        loadingLabel="Loading social links"
      />

      <SocialLinkFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        onSaved={() => {
          void tableRef.current?.reload();
        }}
      />
      {confirmDialog}
    </div>
  );
}
