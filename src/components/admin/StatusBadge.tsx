import type { ReservationStatus } from "@/lib/api/reservations";
import { cn } from "@/lib/utils";

const TONE: Record<ReservationStatus, string> = {
  Reviewing: "bg-amber-100 text-amber-800",
  Accept: "bg-emerald-100 text-emerald-800",
  Completed: "bg-sky-100 text-sky-800",
  Declined: "bg-red-100 text-red-700",
  Rejection: "bg-red-100 text-red-950",
};

const STATUS_MENU_HIGHLIGHT: Record<ReservationStatus, string> = {
  Reviewing:
    "data-[highlighted]:bg-amber-200/80 data-[highlighted]:text-amber-900 focus:bg-amber-200/80 focus:text-amber-900",
  Accept:
    "data-[highlighted]:bg-emerald-200/80 data-[highlighted]:text-emerald-900 focus:bg-emerald-200/80 focus:text-emerald-900",
  Completed:
    "data-[highlighted]:bg-sky-200/80 data-[highlighted]:text-sky-900 focus:bg-sky-200/80 focus:text-sky-900",
  Declined:
    "data-[highlighted]:bg-red-200/80 data-[highlighted]:text-red-800 focus:bg-red-200/80 focus:text-red-800",
  Rejection:
    "data-[highlighted]:bg-red-200/80 data-[highlighted]:text-red-950 focus:bg-red-200/80 focus:text-red-950",
};

/** Full-row / pill fill for the reservations status selector. */
export function statusSurfaceTone(status: ReservationStatus): string {
  return cn(
    TONE[status] ?? "bg-muted text-muted-foreground",
    STATUS_MENU_HIGHLIGHT[status] ??
      "data-[highlighted]:bg-muted focus:bg-muted data-[highlighted]:text-muted-foreground",
  );
}

/** Solid dot colours for status selector rows (matches mockup swatches). */
export const STATUS_DOT: Record<ReservationStatus, string> = {
  Reviewing: "bg-amber-500",
  Accept: "bg-emerald-500",
  Completed: "bg-sky-500",
  Declined: "bg-red-500",
  Rejection: "bg-red-800",
};

/** Dot + label without a filled pill — for selects and menus. */
export function StatusIndicator({
  status,
  className,
}: {
  status: ReservationStatus;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-1.5 text-xs", className)}>
      <span
        className={cn("size-2 shrink-0 rounded-full", STATUS_DOT[status] ?? "bg-muted-foreground")}
        aria-hidden="true"
      />
      <span className="truncate text-foreground">{status}</span>
    </span>
  );
}

/** Reservation status pill: a coloured dot and label, the same everywhere in the admin. */
export function StatusBadge({ status, className }: { status: ReservationStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center gap-1.5 rounded-full px-2 text-xs font-medium whitespace-nowrap",
        TONE[status] ?? "bg-muted text-muted-foreground",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}
