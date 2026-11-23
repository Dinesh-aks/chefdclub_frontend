import { cn } from "@/lib/utils";

export const CMS_STATUS_LABELS = {
  activeHidden: { active: "Active", inactive: "Inactive" },
  publishedHidden: { active: "Active", inactive: "Inactive" },
  activeInactive: { active: "Active", inactive: "Inactive" },
} as const;

type CmsStatusLabelSet = (typeof CMS_STATUS_LABELS)[keyof typeof CMS_STATUS_LABELS];

/** On/off CMS status pill — green when live, muted when off (tables, lists). */
export function CmsStatusBadge({
  active,
  labels = CMS_STATUS_LABELS.activeHidden,
  className,
}: {
  active: boolean;
  labels?: CmsStatusLabelSet;
  className?: string;
}) {
  const label = active ? labels.active : labels.inactive;

  return (
    <span
      className={cn(
        "inline-flex h-5 items-center gap-1.5 rounded-full px-2 text-xs font-medium whitespace-nowrap",
        active ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          active ? "bg-emerald-600" : "bg-muted-foreground/70",
        )}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
