"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SortingState, Updater } from "@tanstack/react-table";
import {
  DEFAULT_TABLE_PAGE_SIZE,
  type ServerDataTableState,
} from "@/components/admin/data-table/DataTable";
import type { AdminListPage, AdminListParams } from "@/lib/api/core/adminList";

type FetchPage<T, Extra> = (params: AdminListParams & Extra) => Promise<AdminListPage<T>>;

function sortFromState(
  sorting: SortingState,
  fallback: { sort: string; order: "asc" | "desc" },
): { sort: string; order: "asc" | "desc" } {
  const column = sorting[0];
  if (!column) return fallback;
  return { sort: column.id, order: column.desc ? "desc" : "asc" };
}

export function useServerAdminTable<T, Extra extends Record<string, unknown> = Record<string, never>>(
  options: {
    fetchPage: FetchPage<T, Extra>;
    extraParams?: Extra;
    defaultSortField?: string;
    defaultOrder?: "asc" | "desc";
    defaultSorting?: SortingState;
  },
) {
  const fallbackSort = options.defaultSortField ?? "id";
  const fallbackOrder = options.defaultOrder ?? "desc";
  const [items, setItems] = useState<T[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_TABLE_PAGE_SIZE);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>(
    options.defaultSorting ?? [{ id: fallbackSort, desc: fallbackOrder === "desc" }],
  );
  const [loadError, setLoadError] = useState("");

  const extraParams = options.extraParams ?? ({} as Extra);
  const extraKey = JSON.stringify(extraParams);

  const fetchPageRef = useRef(options.fetchPage);
  fetchPageRef.current = options.fetchPage;

  const loadList = useCallback(async () => {
    const { sort, order } = sortFromState(sorting, { sort: fallbackSort, order: fallbackOrder });
    try {
      const result = await fetchPageRef.current({
        page,
        limit,
        search: search || undefined,
        sort,
        order,
        ...extraParams,
      } as AdminListParams & Extra);
      setItems(result.items);
      setTotal(result.total);
      setLoadError("");
      return result;
    } catch {
      setLoadError("Could not load data.");
      throw new Error("load failed");
    }
  }, [extraKey, fallbackOrder, fallbackSort, limit, page, search, sorting]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const prevSearchRef = useRef(search);
  useEffect(() => {
    if (prevSearchRef.current !== search) {
      prevSearchRef.current = search;
      setPage(1);
    }
  }, [search]);

  useEffect(() => {
    void loadList().catch(() => undefined);
  }, [loadList]);

  function handleSortingChange(updater: Updater<SortingState>) {
    setSorting(updater);
    setPage(1);
  }

  const server: ServerDataTableState = {
    total,
    page,
    pageSize: limit,
    search: searchInput,
    onSearchChange: setSearchInput,
    sorting,
    onSortingChange: handleSortingChange,
    onPageChange: setPage,
    onPageSizeChange: (size) => {
      setLimit(size);
      setPage(1);
    },
  };

  return {
    items,
    total,
    loading: items === null,
    loadError,
    setLoadError,
    server,
    reload: loadList,
    setPage,
  };
}
