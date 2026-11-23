"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/core/client";
import {
  fetchAdminReservations,
  updateAdminReservationStatus,
  type AdminReservationListParams,
  type ReservationRecord,
  type ReservationStatus,
} from "@/lib/api/reservations";
import { DataTable } from "@/components/admin/data-table/DataTable";
import { InkDots } from "@/components/shared/InkDots";
import { useServerAdminTable } from "@/hooks/useServerAdminTable";
import { ReservationDetailDialog } from "@/features/admin/reservations/components/ReservationDetailDialog";
import { ReservationsFilters } from "@/features/admin/reservations/components/ReservationsFilters";
import { createReservationsTableColumns } from "@/features/admin/reservations/components/reservationsTableColumns";
import {
  ALL_STATUSES,
  EMPTY_RESERVATION_FILTERS,
  type ReservationFilters,
} from "@/features/admin/reservations/reservationsUtils";

export function ReservationsManager() {
  const [filters, setFilters] = useState<ReservationFilters>(EMPTY_RESERVATION_FILTERS);
  const [selected, setSelected] = useState<ReservationRecord | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const filterParams = useMemo(
    () => ({
      status: filters.status === ALL_STATUSES ? undefined : (filters.status as ReservationStatus),
      dateFrom: filters.from || undefined,
      dateTo: filters.to || undefined,
      guest: Number(filters.guest) || undefined,
    }),
    [filters],
  );

  const {
    items: reservations,
    loading,
    loadError,
    server,
    reload,
    setLoadError,
    setPage,
  } = useServerAdminTable<
    ReservationRecord,
    {
      status?: ReservationStatus;
      dateFrom?: string;
      dateTo?: string;
      guest?: number;
    }
  >({
    fetchPage: async (params) => {
      try {
        const response = await fetchAdminReservations(params as AdminReservationListParams);
        return response.data;
      } catch (err) {
        setLoadError(err instanceof ApiError ? err.message : "Could not load reservations.");
        throw err;
      }
    },
    extraParams: filterParams,
    defaultSortField: "addDate",
    defaultOrder: "desc",
    defaultSorting: [{ id: "addDate", desc: true }],
  });

  async function handleStatusChange(reservation: ReservationRecord, status: ReservationStatus) {
    setUpdatingId(reservation.id);
    try {
      await updateAdminReservationStatus(reservation.id, status);
      await reload();
      toast.success("Status updated", {
        description: `Request #${reservation.id} · ${status}`,
      });
      setLoadError("");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not update this reservation.";
      toast.error(message);
      setLoadError(message);
    } finally {
      setUpdatingId(null);
    }
  }

  const columns = useMemo(
    () =>
      createReservationsTableColumns({
        updatingId,
        onViewDetails: setSelected,
        onStatusChange: (reservation, status) => void handleStatusChange(reservation, status),
      }),
    [updatingId],
  );

  function setFilter<K extends keyof ReservationFilters>(key: K, value: ReservationFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  function resetFilters() {
    setFilters(EMPTY_RESERVATION_FILTERS);
    setPage(1);
  }

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg font-semibold">Reservations</h1>
        <p className="text-muted-foreground">
          Every private dining request submitted through the website.
        </p>
      </div>

      {loadError ? <p className="text-sm text-destructive">{loadError}</p> : null}

      {loading ? (
        <InkDots label="Loading reservations" />
      ) : (
        <>
          <ReservationsFilters filters={filters} onFilterChange={setFilter} onReset={resetFilters} />

          <DataTable
            columns={columns}
            data={reservations ?? []}
            searchPlaceholder="Search reservations…"
            emptyMessage="No reservations match your search or filters."
            server={server}
          />
        </>
      )}

      <ReservationDetailDialog
        selected={selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        onSaved={(record) => {
          setSelected(record);
          void reload();
          setLoadError("");
        }}
        onError={setLoadError}
      />
    </div>
  );
}
