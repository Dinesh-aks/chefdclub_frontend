"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { ApiError } from "@/lib/api/core/client";
import {
  deleteAdminBlogPost,
  fetchAdminBlogCategories,
  fetchAdminBlogPosts,
  type BlogCategoryRecord,
  type BlogPostListItem,
} from "@/lib/api/blog";
import { Button } from "@/components/ui/button";
import { AdminDataTable, type AdminDataTableHandle } from "@/components/admin/AdminDataTable";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { BlogPostFilters } from "@/features/admin/cms/blog/components/BlogPostFilters";
import {
  EMPTY_BLOG_POST_FILTERS,
  blogPostFilterParams,
  type BlogPostFilters as BlogPostFiltersState,
} from "@/features/admin/cms/blog/blogPostFilters";
import { createBlogPostsTableColumns } from "@/features/admin/cms/blog/components/blogPostsTableColumns";

export function BlogPostsManager() {
  const tableRef = useRef<AdminDataTableHandle>(null);
  const [filters, setFilters] = useState<BlogPostFiltersState>(EMPTY_BLOG_POST_FILTERS);
  const [categories, setCategories] = useState<BlogCategoryRecord[]>([]);
  const [actionError, setActionError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Only feeds the Category filter dropdown; the table rows already carry their category name.
  useEffect(() => {
    let cancelled = false;
    fetchAdminBlogCategories({ limit: 100, page: 1, sort: "sort", order: "asc" })
      .then((response) => {
        if (!cancelled) setCategories(response.data.items);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const filterParams = useMemo(() => blogPostFilterParams(filters), [filters]);

  const { confirm, confirmDialog } = useConfirm();

  async function handleDelete(post: BlogPostListItem) {
    if (!(await confirm(`Delete "${post.title}"?`))) {
      return;
    }
    setDeletingId(post.id);
    try {
      await deleteAdminBlogPost(post.id);
      await tableRef.current?.reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not delete this post.");
    } finally {
      setDeletingId(null);
    }
  }

  const columns = useMemo(
    () =>
      createBlogPostsTableColumns({
        deletingId,
        onDelete: (post) => void handleDelete(post),
      }),
    [deletingId],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Blog Posts</h1>
          <p className="mt-2 text-muted-foreground">
            Journal posts shown on the public Journal page.
          </p>
        </div>
        <Button type="button" asChild>
          <Link href="/admin/cms/journal/posts/new">
            <PlusIcon className="size-4" aria-hidden="true" />
            Add Post
          </Link>
        </Button>
      </div>

      {actionError ? <p className="text-sm text-destructive">{actionError}</p> : null}

      <BlogPostFilters
        filters={filters}
        categories={categories}
        onFilterChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
        onReset={() => setFilters(EMPTY_BLOG_POST_FILTERS)}
      />

      <AdminDataTable
        ref={tableRef}
        extraParams={filterParams}
        columns={columns}
        fetchPage={(params) => fetchAdminBlogPosts(params).then((r) => r.data)}
        searchPlaceholder="Search posts…"
        emptyMessage="No posts match your search."
        defaultSortField="updatedAt"
        defaultOrder="desc"
        loadingLabel="Loading posts"
      />
      {confirmDialog}
    </div>
  );
}
