import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { reserveNavItem } from "@/config/nav";

/** End-of-article invitation to book: a dark rounded card with the reserve button. */
export function JournalReserveCta() {
  return (
    <Section tone="default" padding="none" className="pt-4 pb-16 md:pb-20">
      <Reveal>
        <div className="tone-ink flex flex-col items-start justify-between gap-6 rounded-md bg-background p-8 text-foreground sm:flex-row sm:items-center sm:p-10 lg:px-12">
          <div>
            <p className="text-xs tracking-mega text-primary uppercase">Dine with us</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
              Taste the story, <em>at the table.</em>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Private dining at Keppel Bay Drive. Weekends, exceptions on request.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href={reserveNavItem.href}>{reserveNavItem.label}</Link>
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
