import type { ReactNode } from "react";

/** A titled block inside an admin form, with an optional one-line description. */
export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description ? <p className="mt-1 text-[13px] text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

/** A FormSection inside its own bordered card; used to lay admin forms out as stacked cards. */
export function FormCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <FormSection title={title} description={description}>
        {children}
      </FormSection>
    </div>
  );
}
