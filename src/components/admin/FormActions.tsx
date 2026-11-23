import type { ReactNode } from "react";

/** Cancel/Save buttons at the end of an admin form, right-aligned, with the form error beside them. */
export function FormActions({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-end gap-x-4 gap-y-3">
      {error ? <p className="min-w-0 flex-1 text-sm text-destructive">{error}</p> : null}
      <div className="flex shrink-0 gap-3">{children}</div>
    </div>
  );
}
