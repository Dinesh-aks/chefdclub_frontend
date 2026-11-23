"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { ApiError } from "@/lib/api/core/client";
import {
  deleteAdminSpotlight,
  fetchAdminSpotlightList,
  SPOTLIGHT_PLACEMENT_LABELS,
  type SpotlightPlacement,
  type SpotlightRecord,
} from "@/lib/api/spotlight";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminDataTable, type AdminDataTableHandle } from "@/components/admin/AdminDataTable";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { createSpotlightTableColumns } from "@/features/admin/cms/spotlight/components/spotlightTableColumns";

const ALL = "all";

export function SpotlightManager() {
  const router = useRouter();
  const [placement, setPlacement] = useState<SpotlightPlacement | typeof ALL>(ALL);

  const tableRef = useRef<AdminDataTableHandle>(null);
  const [actionError, setActionError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { confirm, confirmDialog } = useConfirm();

  async function handleDelete(card: SpotlightRecord) {
    if (!(await confirm(card.title ? `Delete "${card.title}"?` : "Delete this card?"))) {
      return;
    }
    setDeletingId(card.id);
    try {
      await deleteAdminSpotlight(card.id);
      setActionError("");
      await tableRef.current?.reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not delete this photo card.");
    } finally {
      setDeletingId(null);
    }
  }

  const columns = useMemo(
    () =>
      createSpotlightTableColumns({
        deletingId,
        onEdit: (card) => router.push(`/admin/cms/spotlight/${card.id}/edit`),
        onDelete: (card) => void handleDelete(card),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deletingId, router],
  );

  const extraParams = useMemo(() => (placement === ALL ? {} : { placement }), [placement]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Homepage Photo Cards</h1>
          <p className="mt-2 text-muted-foreground">
            The dish photo cards on the homepage: beside the headline at the top (Hero) and in the
            dining section further down (Story). Set a card to Inactive to hide it.
          </p>
        </div>
        <Button type="button" asChild>
          <Link href="/admin/cms/spotlight/new">
            <PlusIcon className="size-4" aria-hidden="true" />
            Add Card
          </Link>
        </Button>
      </div>

      {actionError ? <p className="text-sm text-destructive">{actionError}</p> : null}

      <section aria-label="Filters" className="rounded-lg border border-border bg-card p-3">
        <div className="max-w-xs space-y-1">
          <Label htmlFor="filter-spotlight-placement">Where it shows</Label>
          <Select
            value={placement}
            onValueChange={(value) => setPlacement(value as SpotlightPlacement | typeof ALL)}
          >
            <SelectTrigger id="filter-spotlight-placement" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All</SelectItem>
              {(Object.keys(SPOTLIGHT_PLACEMENT_LABELS) as SpotlightPlacement[]).map((value) => (
                <SelectItem key={value} value={value}>
                  {SPOTLIGHT_PLACEMENT_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <AdminDataTable
        ref={tableRef}
        extraParams={extraParams}
        columns={columns}
        fetchPage={(params) => fetchAdminSpotlightList(params).then((r) => r.data)}
        searchPlaceholder="Search cards…"
        emptyMessage="No photo cards yet."
        defaultSortField="sort"
        defaultOrder="asc"
        loadingLabel="Loading photo cards"
      />

      {confirmDialog}
    </div>
  );
}
