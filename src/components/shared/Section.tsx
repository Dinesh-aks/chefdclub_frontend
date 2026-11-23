import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/Container";

export type SectionTone = "default" | "ink";

export type SectionPadding = "default" | "none" | "top" | "bottom" | "afterHero";

interface SectionProps extends React.ComponentProps<"section"> {
  tone?: SectionTone;
  /** Set false to control the inner container yourself (e.g. full-bleed media). */
  container?: boolean;
  /**
   * Vertical section padding. Use `"none"` or `"top"` / `"bottom"` when a section
   * must sit flush against its neighbor — `pt-0` / `pb-0` in `className` cannot
   * override the default `py-*` utilities because `cn` does not dedupe Tailwind.
   */
  padding?: SectionPadding;
}

const toneClassName: Record<SectionTone, string> = {
  default: "bg-background text-foreground",
  // Re-scopes the semantic color variables for this subtree — see
  // docs/ARCHITECTURE.md ("Colors & tone system") for why this isn't `dark:`.
  ink: "tone-ink bg-background text-foreground",
};

const paddingClassName: Record<SectionPadding, string> = {
  default: "py-16 md:py-24 lg:py-32",
  none: "",
  top: "pt-16 md:pt-24 lg:pt-32",
  bottom: "pb-16 md:pb-24 lg:pb-32",
  /** First light section below a `PageHero` — moderate top gap, standard bottom rhythm. */
  afterHero: "pt-10 pb-16 md:pt-14 md:pb-24 lg:pt-16 lg:pb-32",
};

/**
 * The standard vertical rhythm + background tone wrapper for a page section.
 * Every website page is composed of `Section`s so spacing and the
 * light/dark brand tones stay consistent without repeating classes.
 */
export function Section({
  tone = "default",
  container = true,
  padding = "default",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(paddingClassName[padding], toneClassName[tone], className)}
      {...props}
    >
      {container ? <Container>{children}</Container> : children}
    </section>
  );
}
