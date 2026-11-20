"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { ApiError } from "@/lib/api/core/client";
import { deleteAdminHighlight, fetchAdminHighlights, type HighlightRecord } from "@/lib/api/highlights";
import { Button } from "@/components/ui/button";
import { AdminDataTable, type AdminDataTableHandle } from "@/components/admin/AdminDataTable";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { HighlightFilters } from "@/features/admin/cms/highlights/components/HighlightFilters";
import { createHighlightsTableColumns } from "@/features/admin/cms/highlights/components/highlightsTableColumns";
import {
  EMPTY_HIGHLIGHT_FILTERS,
  highlightFilterParams,
  type HighlightFilters as HighlightFiltersState,
} from "@/features/admin/cms/highlights/highlightFilters";

export function HighlightsManager() {
  const router = useRouter();
  const tableRef = useRef<AdminDataTableHandle>(null);
  const [filters, setFilters] = useState<HighlightFiltersState>(EMPTY_HIGHLIGHT_FILTERS);
  const [actionError, setActionError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { confirm, confirmDialog } = useConfirm();

  async function handleDelete(highlight: HighlightRecord) {
    if (!(await confirm(`Delete "${highlight.name ?? "this highlight"}"?`))) {
      return;
    }
    setDeletingId(highlight.id);
    try {
      await deleteAdminHighlight(highlight.id);
      await tableRef.current?.reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not delete this highlight.");
    } finally {
      setDeletingId(null);
    }
  }

  const filterParams = useMemo(() => highlightFilterParams(filters), [filters]);

  const columns = useMemo(
    () =>
      createHighlightsTableColumns({
        deletingId,
        onEdit: (highlight) => {
          router.push(`/admin/cms/highlights/${highlight.id}/edit`);
        },
        onDelete: (highlight) => void handleDelete(highlight),
      }),
    [deletingId, router],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Homepage Highlights</h1>
          <p className="mt-2 text-muted-foreground">Promo/spotlight cards shown on the homepage.</p>
        </div>
        <Button type="button" asChild>
          <Link href="/admin/cms/highlights/new">
            <PlusIcon className="size-4" aria-hidden="true" />
            Add Highlight
          </Link>
        </Button>
      </div>

      {actionError ? <p className="text-sm text-destructive">{actionError}</p> : null}

      <HighlightFilters
        filters={filters}
        onFilterChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
        onReset={() => setFilters(EMPTY_HIGHLIGHT_FILTERS)}
      />

      <AdminDataTable
        ref={tableRef}
        extraParams={filterParams}
        columns={columns}
        fetchPage={(params) => fetchAdminHighlights(params).then((r) => r.data)}
        searchPlaceholder="Search highlights…"
        emptyMessage="No highlights match your search."
        defaultSortField="sort"
        defaultOrder="asc"
        loadingLabel="Loading highlights"
      />

      {confirmDialog}
    </div>
  );
}
