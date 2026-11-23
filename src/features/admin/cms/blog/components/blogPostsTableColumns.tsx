"use client";

import Link from "next/link";
import { SquarePen } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  AdminTableActions,
  AdminTableDeleteButton,
  AdminTableEditButton,
} from "@/components/admin/AdminTableActionButtons";
import { CMS_STATUS_LABELS, CmsStatusBadge } from "@/components/admin/CmsStatusBadge";
import type { BlogPostListItem } from "@/lib/api/blog";

export function createBlogPostsTableColumns({
  deletingId,
  onDelete,
}: {
  deletingId: number | null;
  onDelete: (post: BlogPostListItem) => void;
}): ColumnDef<BlogPostListItem>[] {
  return [
    {
      id: "category",
      accessorFn: (post) => post.categoryName ?? `Category ${post.catId}`,
      header: "Category",
    },
    { accessorKey: "title", header: "Title" },
    {
      id: "status",
      accessorFn: (post) => (post.status ? "Active" : "Inactive"),
      header: "Status",
      cell: (info) => (
        <CmsStatusBadge
          active={info.row.original.status}
          labels={CMS_STATUS_LABELS.publishedHidden}
        />
      ),
    },
    { accessorKey: "viewCount", header: "Views" },
    { accessorKey: "likeCount", header: "Likes" },
    {
      id: "actions",
      header: () => <span className="block text-right">Action</span>,
      enableSorting: false,
      enableGlobalFilter: false,
      cell: (info) => {
        const post = info.row.original;
        return (
          <AdminTableActions>
            <AdminTableEditButton asChild>
              <Link href={`/admin/cms/journal/posts/${post.id}/edit`}>
                <SquarePen className="size-4" strokeWidth={2} aria-hidden="true" />
              </Link>
            </AdminTableEditButton>
            <AdminTableDeleteButton
              disabled={deletingId === post.id}
              onClick={() => void onDelete(post)}
            />
          </AdminTableActions>
        );
      },
    },
  ];
}
