import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Heading } from "@/components/shared/Heading";
import { Reveal } from "@/components/shared/Reveal";
import { Section, type SectionPadding } from "@/components/shared/Section";

interface PageHeroProps {
  /** Small tracked label above the title (e.g. "Gallery"). */
  eyebrow: string;
  /** Display title — wrap accent words in `<em>`. */
  children: ReactNode;
  /** Optional intro copy under the title. */
  description?: ReactNode;
  descriptionClassName?: string;
  padding?: SectionPadding;
  /** When true (default), uses tighter bottom spacing before the next section. */
  bottomFlush?: boolean;
  className?: string;
}

/**
 * Ink-tone page header used at the top of most marketing routes
 * (eyebrow + display heading + optional lede).
 */
export function PageHero({
  eyebrow,
  children,
  description,
  descriptionClassName,
  padding = "none",
  bottomFlush = true,
  className,
}: PageHeroProps) {
  return (
    <Section
      tone="ink"
      padding={padding}
      className={cn(
        padding === "none" && "pt-10 md:pt-12 lg:pt-14",
        padding === "none" &&
          (bottomFlush ? "pb-8 md:pb-10 lg:pb-12" : "pb-12 md:pb-16 lg:pb-20"),
        className,
      )}
    >
      <Reveal>
        <Heading as="h1" size="display" eyebrow={eyebrow}>
          {children}
        </Heading>
        {description ? (
          typeof description === "string" ? (
            <p
              className={cn(
                "mt-6 max-w-xl text-lg text-muted-foreground",
                descriptionClassName,
              )}
            >
              {description}
            </p>
          ) : (
            <div
              className={cn(
                "mt-6 max-w-xl text-lg text-muted-foreground",
                descriptionClassName,
              )}
            >
              {description}
            </div>
          )
        ) : null}
      </Reveal>
    </Section>
  );
}
