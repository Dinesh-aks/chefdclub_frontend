import { Heading } from "@/components/shared/Heading";
import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { StaggerGroup } from "@/components/shared/StaggerGroup";
import { StaggerItem } from "@/components/shared/StaggerItem";
import { TextLink } from "@/components/shared/TextLink";
import { diningFormats } from "@/features/website/home/data";
import { reserveNavItem } from "@/config/nav";

export function DiningFormats() {
  return (
    <Section tone="default">
      <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <Heading eyebrow="How we host">Four ways to dine with us</Heading>
        <TextLink href={reserveNavItem.href}>Enquire about a date</TextLink>
      </Reveal>

      <StaggerGroup className="mt-10 grid divide-y divide-border border border-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        {diningFormats.map((format) => (
          <StaggerItem key={format.name} className="flex flex-col p-6">
            <p className="font-serif text-lg text-primary italic">{format.name}</p>
            <h3 className="mt-2 font-serif text-xl">{format.title}</h3>
            <p className="mt-3 flex-1 text-sm text-muted-foreground">{format.description}</p>
            <TextLink href={reserveNavItem.href} className="mt-6 self-start">
              {format.action}
            </TextLink>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}
