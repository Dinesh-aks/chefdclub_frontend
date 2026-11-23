"use client";

import { useMemo, useRef, useState } from "react";
import { PlusIcon } from "lucide-react";
import { ApiError } from "@/lib/api/core/client";
import {
  deleteAdminBlogCategory,
  fetchAdminBlogCategories,
  type BlogCategoryRecord,
} from "@/lib/api/blog";
import { Button } from "@/components/ui/button";
import { AdminDataTable, type AdminDataTableHandle } from "@/components/admin/AdminDataTable";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { BlogCategoryFormDialog } from "@/features/admin/cms/blog/components/BlogCategoryFormDialog";
import { createBlogCategoryTableColumns } from "@/features/admin/cms/blog/components/blogCategoryTableColumns";

export function BlogCategoriesManager() {
  const tableRef = useRef<AdminDataTableHandle>(null);
  const [actionError, setActionError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BlogCategoryRecord | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { confirm, confirmDialog } = useConfirm();

  async function handleDelete(category: BlogCategoryRecord) {
    if (!(await confirm(`Delete "${category.category}"?`))) {
      return;
    }
    setDeletingId(category.id);
    try {
      await deleteAdminBlogCategory(category.id);
      await tableRef.current?.reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not delete this category.");
    } finally {
      setDeletingId(null);
    }
  }

  const columns = useMemo(
    () =>
      createBlogCategoryTableColumns({
        deletingId,
        onEdit: (category) => {
          setEditing(category);
          setDialogOpen(true);
        },
        onDelete: (category) => void handleDelete(category),
      }),
    [deletingId],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Blog Categories</h1>
          <p className="mt-2 text-muted-foreground">Categories used to organize journal posts.</p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <PlusIcon className="size-4" aria-hidden="true" />
          Add Category
        </Button>
      </div>

      {actionError ? <p className="text-sm text-destructive">{actionError}</p> : null}

      <AdminDataTable
        ref={tableRef}
        columns={columns}
        fetchPage={(params) => fetchAdminBlogCategories(params).then((r) => r.data)}
        searchPlaceholder="Search categories…"
        emptyMessage="No categories match your search."
        defaultSortField="sort"
        defaultOrder="asc"
        loadingLabel="Loading categories"
      />

      <BlogCategoryFormDialog
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
