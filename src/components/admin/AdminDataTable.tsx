"use client";

import { forwardRef, useImperativeHandle } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ApiError } from "@/lib/api/core/client";
import type { AdminListPage, AdminListParams } from "@/lib/api/core/adminList";
import { useServerAdminTable } from "@/hooks/useServerAdminTable";
import { InkDots } from "@/components/shared/InkDots";
import { DataTable } from "@/components/admin/data-table/DataTable";

export type AdminDataTableHandle = {
  reload: () => Promise<unknown>;
};

type AdminDataTableProps<T> = {
  columns: ColumnDef<T, unknown>[];
  fetchPage: (params: AdminListParams & Record<string, unknown>) => Promise<AdminListPage<T>>;
  searchPlaceholder?: string;
  emptyMessage?: string;
  defaultSortField?: string;
  defaultOrder?: "asc" | "desc";
  extraParams?: Record<string, unknown>;
  loadingLabel?: string;
};

function AdminDataTableInner<T>(
  {
    columns,
    fetchPage,
    searchPlaceholder,
    emptyMessage,
    defaultSortField,
    defaultOrder,
    extraParams,
    loadingLabel = "Loading",
  }: AdminDataTableProps<T>,
  ref: React.Ref<AdminDataTableHandle>,
) {
  const { items, loading, loadError, setLoadError, server, reload } = useServerAdminTable<
    T,
    Record<string, unknown>
  >({
    fetchPage: async (params) => {
      try {
        return await fetchPage(params);
      } catch (err) {
        setLoadError(err instanceof ApiError ? err.message : "Could not load data.");
        throw err;
      }
    },
    extraParams,
    defaultSortField,
    defaultOrder,
  });

  useImperativeHandle(ref, () => ({ reload }), [reload]);

  if (loading) {
    return <InkDots label={loadingLabel} />;
  }

  return (
    <div className="space-y-2">
      {loadError ? <p className="text-sm text-destructive">{loadError}</p> : null}
      <DataTable
        columns={columns}
        data={items ?? []}
        searchPlaceholder={searchPlaceholder}
        emptyMessage={emptyMessage}
        server={server}
      />
    </div>
  );
}

export const AdminDataTable = forwardRef(AdminDataTableInner) as <T>(
  props: AdminDataTableProps<T> & { ref?: React.Ref<AdminDataTableHandle> },
) => ReturnType<typeof AdminDataTableInner>;
