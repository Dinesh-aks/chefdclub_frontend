import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/shared/Heading";
import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { reserveNavItem } from "@/config/nav";

export function ClosingCta() {
  return (
    <Section tone="ink" className="py-16 md:py-20 lg:py-24">
      <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <Heading as="h2" size="section">
            Let&rsquo;s set a date.
          </Heading>
          <p className="mt-2 text-lg text-muted-foreground">
            Weekends fill first. Tell us about the evening you have in mind.
          </p>
        </div>
        <Button asChild size="lg" className="group">
          <Link href={reserveNavItem.href}>
            {reserveNavItem.label}
            <ArrowRightIcon
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </Button>
      </Reveal>
    </Section>
  );
}
