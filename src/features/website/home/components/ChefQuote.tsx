import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";

export function ChefQuote() {
  return (
    <Section tone="default">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="flex items-center justify-center gap-3 text-xs tracking-mega text-muted-foreground uppercase">
          <span className="h-px w-6 bg-primary" aria-hidden="true" />
          The chef
          <span className="h-px w-6 bg-primary" aria-hidden="true" />
        </p>
        <blockquote className="mx-auto mt-6 max-w-xl font-serif text-2xl italic leading-snug sm:text-3xl">
          &ldquo;I visualise countless combinations before narrowing it down to a unique
          recipe. Food, for me, is love made visible.&rdquo;
        </blockquote>
        <p className="mt-6 text-xs tracking-mega text-muted-foreground uppercase">
          Ashish Poddar — Chef &amp; Founder
        </p>
      </Reveal>
    </Section>
  );
}
