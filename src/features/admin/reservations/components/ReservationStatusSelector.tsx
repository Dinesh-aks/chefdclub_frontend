"use client";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import type { ReservationRecord, ReservationStatus } from "@/lib/api/reservations";
import { STATUS_DOT, statusSurfaceTone } from "@/components/admin/StatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { RESERVATION_STATUSES } from "@/features/admin/reservations/reservationsUtils";

const TRIGGER_CLASS =
  "inline-flex h-6 min-w-[5.75rem] max-w-full items-center justify-between gap-1 rounded-full px-2.5 text-left text-xs font-medium outline-none transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50";

function StatusRowLabel({ status }: { status: ReservationRecord["status"] }) {
  return (
    <span className="inline-flex min-w-0 flex-1 items-center gap-2">
      <span
        className={cn("size-2 shrink-0 rounded-full", STATUS_DOT[status] ?? "bg-muted-foreground")}
        aria-hidden="true"
      />
      <span className="truncate">{status}</span>
    </span>
  );
}

interface ReservationStatusSelectorProps {
  reservation: ReservationRecord;
  disabled?: boolean;
  onStatusChange: (reservation: ReservationRecord, status: ReservationStatus) => void;
}

export function ReservationStatusSelector({
  reservation,
  disabled,
  onStatusChange,
}: ReservationStatusSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        className={cn(TRIGGER_CLASS, statusSurfaceTone(reservation.status))}
        aria-label={`Change status, currently ${reservation.status}`}
      >
        <StatusRowLabel status={reservation.status} />
        <ChevronDownIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="flex min-w-[10.25rem] flex-col gap-1.5 p-1.5 shadow-md"
      >
        {RESERVATION_STATUSES.map((status) => {
          const isCurrent = status === reservation.status;
          return (
            <DropdownMenuItem
              key={status}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-2 text-xs font-medium",
                statusSurfaceTone(status),
              )}
              onClick={() => {
                if (!isCurrent) onStatusChange(reservation, status);
              }}
            >
              <StatusRowLabel status={status} />
              {isCurrent ? (
                <CheckIcon className="size-3.5 shrink-0 text-current" aria-hidden="true" />
              ) : (
                <span className="size-3.5 shrink-0" aria-hidden="true" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
