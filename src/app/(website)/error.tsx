"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/shared/Heading";
import { Section } from "@/components/shared/Section";

/** Shown when a page can't load its data (for example the backend is briefly unreachable). */
export default function WebsiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <Section tone="ink" className="min-h-[60vh] text-center">
      <div className="mx-auto flex max-w-xl flex-col items-center">
        <Heading as="h1" align="center" eyebrow="Something went wrong">
          We couldn&rsquo;t load this page
        </Heading>
        <p className="mt-6 text-muted-foreground">
          The content didn&rsquo;t load. Please try again in a moment.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="h-12 px-8 text-xs" onClick={reset}>
            Try again
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-8 text-xs">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
