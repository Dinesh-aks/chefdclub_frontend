"use client";

import { SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const actionIconClass = "size-8 shrink-0 rounded-md border-0 shadow-none transition-colors";

export function AdminTableEditButton({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Edit"
      className={cn(
        actionIconClass,
        "bg-sky-100 text-sky-800 hover:bg-sky-200 hover:text-sky-900",
        className,
      )}
      {...props}
    >
      {children ?? <SquarePen className="size-4" strokeWidth={2} aria-hidden="true" />}
    </Button>
  );
}

export function AdminTableDeleteButton({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Delete"
      className={cn(
        actionIconClass,
        "bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-900 disabled:opacity-45",
        className,
      )}
      {...props}
    >
      {children ?? <Trash2 className="size-4" strokeWidth={2} aria-hidden="true" />}
    </Button>
  );
}

export function AdminTableActions({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex justify-end gap-1.5", className)}>{children}</div>;
}
