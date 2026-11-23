"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { ApiError } from "@/lib/api/core/client";
import {
  deleteAdminMenuCategory,
  fetchAdminMenuCategories,
  type AdminMenuCategoryListParams,
  type MenuCategoryRecord,
} from "@/lib/api/menuCategories";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table/DataTable";
import { InkDots } from "@/components/shared/InkDots";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { useServerAdminTable } from "@/hooks/useServerAdminTable";
import { MenuCategoriesFilters } from "@/features/admin/cms/menu-categories/components/MenuCategoriesFilters";
import { createMenuCategoryTableColumns } from "@/features/admin/cms/menu-categories/components/menuCategoryTableColumns";
import {
  EMPTY_MENU_CATEGORY_FILTERS,
  menuCategoryFilterParams,
  type MenuCategoryFilters,
} from "@/features/admin/cms/menu-categories/menuCategoryUtils";

export function MenuCategoriesManager() {
  const router = useRouter();
  const [filters, setFilters] = useState<MenuCategoryFilters>(EMPTY_MENU_CATEGORY_FILTERS);
  const [actionError, setActionError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { confirm, confirmDialog } = useConfirm();

  const filterParams = useMemo(() => menuCategoryFilterParams(filters), [filters]);

  const {
    items: categories,
    loading,
    loadError,
    server,
    reload,
    setLoadError,
    setPage,
  } = useServerAdminTable<MenuCategoryRecord, { status?: boolean }>({
    fetchPage: async (params) => {
      try {
        const response = await fetchAdminMenuCategories(params as AdminMenuCategoryListParams);
        return response.data;
      } catch (err) {
        setLoadError(err instanceof ApiError ? err.message : "Could not load menu categories.");
        throw err;
      }
    },
    extraParams: filterParams,
    defaultSortField: "sort",
    defaultOrder: "asc",
    defaultSorting: [{ id: "sort", desc: false }],
  });

  async function handleDelete(category: MenuCategoryRecord) {
    if (!(await confirm(`Delete "${category.name}"? This drives the site navigation.`))) {
      return;
    }
    setDeletingId(category.id);
    setActionError("");
    try {
      await deleteAdminMenuCategory(category.id);
      await reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not delete this menu category.");
    } finally {
      setDeletingId(null);
    }
  }

  const columns = useMemo(
    () =>
      createMenuCategoryTableColumns({
        deletingId,
        onEdit: (category) => {
          router.push(`/admin/cms/menu-categories/${category.id}/edit`);
        },
        onDelete: (category) => void handleDelete(category),
      }),
    [deletingId, router],
  );

  function setFilter<K extends keyof MenuCategoryFilters>(key: K, value: MenuCategoryFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  function resetFilters() {
    setFilters(EMPTY_MENU_CATEGORY_FILTERS);
    setPage(1);
  }

  const listError = actionError || loadError;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Menu Categories</h1>
          <p className="mt-2 text-muted-foreground">
            The top-level menu taxonomy — drives the site nav and menu pages.
          </p>
        </div>
        <Button type="button" asChild>
          <Link href="/admin/cms/menu-categories/new">
            <PlusIcon className="size-4" aria-hidden="true" />
            Add Category
          </Link>
        </Button>
      </div>

      {listError ? <p className="text-sm text-destructive">{listError}</p> : null}

      {loading ? (
        <InkDots label="Loading menu categories" />
      ) : (
        <>
          <MenuCategoriesFilters
            filters={filters}
            onFilterChange={setFilter}
            onReset={resetFilters}
          />

          <DataTable
            columns={columns}
            data={categories ?? []}
            searchPlaceholder="Search categories…"
            emptyMessage="No categories match your search or filters."
            server={server}
          />
        </>
      )}

      {confirmDialog}
    </div>
  );
}
