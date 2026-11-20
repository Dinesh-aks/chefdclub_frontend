import { Heading } from "@/components/shared/Heading";
import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { StaggerGroup } from "@/components/shared/StaggerGroup";
import { StaggerItem } from "@/components/shared/StaggerItem";
import { howItWorks } from "@/features/website/home/data";

export function HowItWorks() {
  return (
    <Section tone="default" className="pt-0 md:pt-0 lg:pt-0">
      <Reveal>
        <Heading eyebrow="How it works">From enquiry to the last course</Heading>
      </Reveal>

      <StaggerGroup className="mt-10 grid gap-8 sm:grid-cols-3">
        {howItWorks.map((item) => (
          <StaggerItem key={item.step} className="border-t border-border pt-6">
            <p className="font-serif text-2xl text-primary italic">{item.step}</p>
            <h3 className="mt-2 font-serif text-lg">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}
