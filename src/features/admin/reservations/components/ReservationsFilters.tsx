"use client";

import { DateField, formatIsoDate, parseIsoDate } from "@/components/shared/DateField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ADMIN_DATE_TRIGGER,
  ALL_STATUSES,
  RESERVATION_STATUSES,
  reservationFiltersActive,
  type ReservationFilters,
} from "@/features/admin/reservations/reservationsUtils";

interface ReservationsFiltersProps {
  filters: ReservationFilters;
  onFilterChange: <K extends keyof ReservationFilters>(key: K, value: ReservationFilters[K]) => void;
  onReset: () => void;
}

export function ReservationsFilters({ filters, onFilterChange, onReset }: ReservationsFiltersProps) {
  const filtersActive = reservationFiltersActive(filters);

  return (
    <section aria-label="Filters" className="space-y-2 rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          disabled={!filtersActive}
          className="rounded px-1 text-[13px] font-medium text-primary hover:underline disabled:pointer-events-none disabled:opacity-40"
        >
          Reset
        </button>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <Label htmlFor="filter-status">Status</Label>
          <Select value={filters.status} onValueChange={(value) => onFilterChange("status", value)}>
            <SelectTrigger id="filter-status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATUSES}>All statuses</SelectItem>
              {RESERVATION_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DateField
          id="filter-from"
          label="Date from"
          placeholder="Any date"
          className="space-y-1"
          triggerClassName={ADMIN_DATE_TRIGGER}
          disablePast={false}
          value={parseIsoDate(filters.from)}
          onChange={(date) => onFilterChange("from", date ? formatIsoDate(date) : "")}
        />
        <DateField
          id="filter-to"
          label="Date to"
          placeholder="Any date"
          className="space-y-1"
          triggerClassName={ADMIN_DATE_TRIGGER}
          disablePast={false}
          value={parseIsoDate(filters.to)}
          onChange={(date) => onFilterChange("to", date ? formatIsoDate(date) : "")}
        />
        <div className="space-y-1">
          <Label htmlFor="filter-guests">Guests</Label>
          <Input
            id="filter-guests"
            type="number"
            min={1}
            placeholder="Any"
            value={filters.guest}
            onChange={(event) => onFilterChange("guest", event.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
