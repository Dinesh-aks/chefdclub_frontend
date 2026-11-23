"use client";

import { useState, type ReactNode } from "react";
import {
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/shared/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const DEFAULT_TABLE_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export type ServerDataTableState = {
  total: number;
  page: number;
  pageSize: number;
  search: string;
  sorting: SortingState;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearchChange: (search: string) => void;
  onSortingChange: OnChangeFn<SortingState>;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  pageSize?: number;
  emptyMessage?: string;
  /** Optional extra controls rendered next to the search box (e.g. a status filter). */
  toolbar?: ReactNode;
  /** Server-driven search, sort, and pagination (TanStack manual modes). */
  server?: ServerDataTableState;
}

/**
 * The admin's shared list table — built on TanStack Table + shadcn Table.
 * Client mode: pass the full dataset; search/sort/page stay in the browser.
 * Server mode: pass `server` + one page of rows; parent refetches on query changes.
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Search…",
  pageSize = DEFAULT_TABLE_PAGE_SIZE,
  emptyMessage = "No results.",
  toolbar,
  server,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [clientPagination, setClientPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const isServer = Boolean(server);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: isServer ? server!.search : globalFilter,
      sorting: isServer ? server!.sorting : sorting,
      pagination: isServer
        ? { pageIndex: server!.page - 1, pageSize: server!.pageSize }
        : clientPagination,
    },
    onGlobalFilterChange: isServer ? undefined : setGlobalFilter,
    onSortingChange: isServer ? server!.onSortingChange : setSorting,
    onPaginationChange: isServer
      ? (updater) => {
          const current = { pageIndex: server!.page - 1, pageSize: server!.pageSize };
          const next = typeof updater === "function" ? updater(current) : updater;
          if (next.pageSize !== current.pageSize) {
            server!.onPageSizeChange(next.pageSize);
            server!.onPageChange(1);
          } else if (next.pageIndex !== current.pageIndex) {
            server!.onPageChange(next.pageIndex + 1);
          }
        }
      : setClientPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: isServer ? undefined : getFilteredRowModel(),
    getSortedRowModel: isServer ? undefined : getSortedRowModel(),
    getPaginationRowModel: isServer ? undefined : getPaginationRowModel(),
    manualPagination: isServer,
    manualSorting: isServer,
    manualFiltering: isServer,
    pageCount: isServer ? Math.max(1, Math.ceil(server!.total / server!.pageSize)) : undefined,
  });

  const rows = table.getRowModel().rows;
  const totalRows = isServer ? server!.total : table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize: currentPageSize } = table.getState().pagination;
  const rangeStart = totalRows === 0 ? 0 : pageIndex * currentPageSize + 1;
  const rangeEnd = Math.min(totalRows, (pageIndex + 1) * currentPageSize);
  const pageSizeOptions = PAGE_SIZE_OPTIONS.includes(currentPageSize)
    ? PAGE_SIZE_OPTIONS
    : [...PAGE_SIZE_OPTIONS, currentPageSize].sort((a, b) => a - b);

  const searchValue = isServer ? server!.search : globalFilter;
  const onSearchInput = (value: string) => {
    if (isServer) {
      server!.onSearchChange(value);
    } else {
      setGlobalFilter(value);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          Show
          <Select
            value={String(currentPageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger size="default" className="w-[4.25rem]" aria-label="Rows per page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          entries
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {toolbar}
          <div className="relative w-full sm:w-64">
            <SearchIcon
              className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={searchValue}
              onChange={(event) => onSearchInput(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="!ps-9 !pe-2.5"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-input bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-0 bg-[var(--table-head)] hover:bg-[var(--table-head)]"
              >
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  const SortIcon =
                    sorted === "asc" ? ArrowUpIcon : sorted === "desc" ? ArrowDownIcon : ArrowUpDownIcon;
                  return (
                    <TableHead
                      key={header.id}
                      className="h-9 border-l border-white/20 px-3 text-[12.5px] font-semibold text-[var(--table-head-foreground)] first:border-l-0"
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          className="flex items-center gap-1.5 hover:opacity-90"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <SortIcon className="size-3 opacity-80" aria-hidden="true" />
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id} className="border-border hover:bg-muted/60">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="h-[42px] border-l border-border px-3 py-0 first:border-l-0"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">
          {totalRows === 0 ? (
            "Showing 0 entries"
          ) : (
            <>
              Showing{" "}
              <b className="font-semibold text-foreground">
                {rangeStart}–{rangeEnd}
              </b>{" "}
              of <b className="font-semibold text-foreground">{totalRows}</b>
            </>
          )}
        </p>
        <Pagination
          page={pageIndex + 1}
          totalPages={Math.max(1, isServer ? Math.ceil(server!.total / server!.pageSize) : table.getPageCount())}
          onPageChange={(page) => table.setPageIndex(page - 1)}
          className="mt-0 justify-end"
        />
      </div>
    </div>
  );
}
