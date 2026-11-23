"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { ApiError } from "@/lib/api/core/client";
import { fetchAdminMenuCategories, type MenuCategoryRecord } from "@/lib/api/menuCategories";
import { deleteAdminMenuCard, fetchAdminMenuCards, type MenuCardRecord } from "@/lib/api/menuCards";
import { Button } from "@/components/ui/button";
import { AdminDataTable, type AdminDataTableHandle } from "@/components/admin/AdminDataTable";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { MenuCardFilters } from "@/features/admin/cms/menu-cards/components/MenuCardFilters";
import { createMenuCardTableColumns } from "@/features/admin/cms/menu-cards/components/menuCardTableColumns";
import {
  EMPTY_MENU_CARD_FILTERS,
  menuCardFilterParams,
  type MenuCardFilters as MenuCardFiltersState,
} from "@/features/admin/cms/menu-cards/menuCardFilters";

export function MenuCardsManager() {
  const router = useRouter();
  const tableRef = useRef<AdminDataTableHandle>(null);
  const [filters, setFilters] = useState<MenuCardFiltersState>(EMPTY_MENU_CARD_FILTERS);
  const [categories, setCategories] = useState<MenuCategoryRecord[]>([]);
  const [actionError, setActionError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { confirm, confirmDialog } = useConfirm();

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const response = await fetchAdminMenuCategories({ limit: 100, page: 1 });
        if (!cancelled) {
          setCategories(response.data.items);
        }
      } catch {
        if (!cancelled) {
          setCategories([]);
        }
      }
    }

    void loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  const filterParams = useMemo(() => menuCardFilterParams(filters), [filters]);

  const categoryName = useMemo(() => {
    const map = new Map(categories.map((category) => [category.id, category.name]));
    return (menu: number) => map.get(menu) ?? `Category ${menu}`;
  }, [categories]);

  async function handleDelete(card: MenuCardRecord) {
    if (!(await confirm(`Delete "${card.name}"?`))) {
      return;
    }
    setDeletingId(card.id);
    try {
      await deleteAdminMenuCard(card.id);
      await tableRef.current?.reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not delete this menu card.");
    } finally {
      setDeletingId(null);
    }
  }

  const columns = useMemo(
    () =>
      createMenuCardTableColumns({
        deletingId,
        categoryName,
        onEdit: (card) => {
          router.push(`/admin/cms/menu-cards/${card.id}/edit`);
        },
        onDelete: (card) => void handleDelete(card),
      }),
    [categoryName, deletingId, router],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Menu Photo Cards</h1>
          <p className="mt-2 text-muted-foreground">
            Dish photo cards shown on the menu pages and homepage.
          </p>
        </div>
        <Button type="button" asChild>
          <Link href="/admin/cms/menu-cards/new">
            <PlusIcon className="size-4" aria-hidden="true" />
            Add Card
          </Link>
        </Button>
      </div>

      {actionError ? <p className="text-sm text-destructive">{actionError}</p> : null}

      <MenuCardFilters
        filters={filters}
        categories={categories}
        onFilterChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
        onReset={() => setFilters(EMPTY_MENU_CARD_FILTERS)}
      />

      <AdminDataTable
        ref={tableRef}
        extraParams={filterParams}
        columns={columns}
        fetchPage={(params) => fetchAdminMenuCards(params).then((r) => r.data)}
        searchPlaceholder="Search menu cards…"
        emptyMessage="No menu cards match your search."
        defaultSortField="sort"
        defaultOrder="asc"
        loadingLabel="Loading menu cards"
      />

      {confirmDialog}
    </div>
  );
}
