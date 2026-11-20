"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { ApiError } from "@/lib/api/core/client";
import { deleteAdminFaq, fetchAdminFaqs, type FaqListItem } from "@/lib/api/faq";
import { Button } from "@/components/ui/button";
import { AdminDataTable, type AdminDataTableHandle } from "@/components/admin/AdminDataTable";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { FaqFilters } from "@/features/admin/cms/faqs/components/FaqFilters";
import {
  EMPTY_FAQ_FILTERS,
  faqFilterParams,
  type FaqFilters as FaqFiltersState,
} from "@/features/admin/cms/faqs/faqConstants";
import { createFaqTableColumns } from "@/features/admin/cms/faqs/components/faqTableColumns";

export function FaqManager() {
  const router = useRouter();
  const [table, setTable] = useState<AdminDataTableHandle | null>(null);
  const [filters, setFilters] = useState<FaqFiltersState>(EMPTY_FAQ_FILTERS);
  const [actionError, setActionError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { confirm, confirmDialog } = useConfirm();

  const handleDelete = useCallback(
    async (faq: FaqListItem) => {
      if (!(await confirm(`Delete "${faq.question}"?`))) {
        return;
      }
      setDeletingId(faq.id);
      try {
        await deleteAdminFaq(faq.id);
        await table?.reload();
      } catch (err) {
        setActionError(err instanceof ApiError ? err.message : "Could not delete this FAQ.");
      } finally {
        setDeletingId(null);
      }
    },
    [confirm, table],
  );

  const filterParams = useMemo(() => faqFilterParams(filters), [filters]);

  const columns = useMemo(
    () =>
      createFaqTableColumns({
        deletingId,
        onEdit: (faq) => {
          router.push(`/admin/cms/faqs/${faq.id}/edit`);
        },
        onDelete: (faq) => void handleDelete(faq),
      }),
    [deletingId, router, handleDelete],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">FAQs</h1>
          <p className="mt-2 text-muted-foreground">
            Manage the questions shown on the homepage and menu pages.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/cms/faqs/new">
            <PlusIcon className="size-4" aria-hidden="true" />
            Add FAQ
          </Link>
        </Button>
      </div>

      {actionError ? <p className="text-sm text-destructive">{actionError}</p> : null}

      <FaqFilters
        filters={filters}
        onFilterChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
        onReset={() => setFilters(EMPTY_FAQ_FILTERS)}
      />

      <AdminDataTable
        ref={setTable}
        extraParams={filterParams}
        columns={columns}
        fetchPage={(params) => fetchAdminFaqs(params).then((r) => r.data)}
        searchPlaceholder="Search FAQs…"
        emptyMessage="No FAQs match your search."
        defaultSortField="sort"
        defaultOrder="asc"
        loadingLabel="Loading FAQs"
      />
      {confirmDialog}
    </div>
  );
}
