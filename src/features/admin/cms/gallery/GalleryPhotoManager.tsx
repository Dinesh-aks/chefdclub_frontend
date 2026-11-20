"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { ApiError } from "@/lib/api/core/client";
import {
  deleteAdminGalleryPhoto,
  fetchAdminGalleryPhotos,
  type GalleryPhotoCategory,
  type GalleryPhotoRecord,
} from "@/lib/api/gallery";
import { Button } from "@/components/ui/button";
import { AdminDataTable, type AdminDataTableHandle } from "@/components/admin/AdminDataTable";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { GalleryFilters } from "@/features/admin/cms/gallery/components/GalleryFilters";
import { createGalleryPhotoTableColumns } from "@/features/admin/cms/gallery/components/galleryPhotoTableColumns";
import {
  EMPTY_GALLERY_FILTERS,
  galleryFilterParams,
  type GalleryFilters as GalleryFiltersState,
} from "@/features/admin/cms/gallery/galleryFilters";
import {
  GALLERY_PHOTO_CATEGORIES,
  GALLERY_PHOTO_CATEGORY_LABELS,
} from "@/features/admin/cms/gallery/galleryPhotoConstants";

const CATEGORY_OPTIONS = GALLERY_PHOTO_CATEGORIES.map((value) => ({
  value,
  label: GALLERY_PHOTO_CATEGORY_LABELS[value],
}));

export function GalleryPhotoManager() {
  const router = useRouter();
  const tableRef = useRef<AdminDataTableHandle>(null);
  const [filters, setFilters] = useState<GalleryFiltersState>(EMPTY_GALLERY_FILTERS);
  const [actionError, setActionError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { confirm, confirmDialog } = useConfirm();

  async function handleDelete(photo: GalleryPhotoRecord) {
    if (!(await confirm(`Delete "${photo.name ?? "this photo"}"?`))) {
      return;
    }
    setDeletingId(photo.id);
    try {
      await deleteAdminGalleryPhoto(photo.id);
      await tableRef.current?.reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not delete this photo.");
    } finally {
      setDeletingId(null);
    }
  }

  const filterParams = useMemo(() => galleryFilterParams<GalleryPhotoCategory>(filters), [filters]);

  const columns = useMemo(
    () =>
      createGalleryPhotoTableColumns({
        deletingId,
        onEdit: (photo) => {
          router.push(`/admin/cms/gallery/photos/${photo.id}/edit`);
        },
        onDelete: (photo) => void handleDelete(photo),
      }),
    [deletingId, router],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Gallery Photos</h1>
          <p className="mt-2 text-muted-foreground">
            Dish photography shown on the public Photo Gallery page.
          </p>
        </div>
        <Button type="button" asChild>
          <Link href="/admin/cms/gallery/photos/new">
            <PlusIcon className="size-4" aria-hidden="true" />
            Add Photo
          </Link>
        </Button>
      </div>

      {actionError ? <p className="text-sm text-destructive">{actionError}</p> : null}

      <GalleryFilters
        idPrefix="filter-photo"
        filters={filters}
        categories={CATEGORY_OPTIONS}
        onFilterChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
        onReset={() => setFilters(EMPTY_GALLERY_FILTERS)}
      />

      <AdminDataTable
        ref={tableRef}
        extraParams={filterParams}
        columns={columns}
        fetchPage={(params) => fetchAdminGalleryPhotos(params).then((r) => r.data)}
        searchPlaceholder="Search photos…"
        emptyMessage="No photos match your search."
        defaultSortField="id"
        defaultOrder="desc"
        loadingLabel="Loading photos"
      />

      {confirmDialog}
    </div>
  );
}
