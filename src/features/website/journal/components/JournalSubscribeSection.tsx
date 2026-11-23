import { Heading } from "@/components/shared/Heading";
import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { JournalSubscribeForm } from "@/features/website/journal/components/JournalSubscribe";

export function JournalSubscribeSection() {
  return (
    <Section tone="ink" padding="none" className="py-16 md:py-20 lg:py-24">
      <Reveal className="mx-auto max-w-2xl">
        <Heading as="h2" size="subsection" eyebrow="Subscribe">
          New essays, and first word on seasonal menus.
        </Heading>
        <JournalSubscribeForm className="mt-8" />
      </Reveal>
    </Section>
  );
}
