import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { StaggerGroup } from "@/components/shared/StaggerGroup";
import { StaggerItem } from "@/components/shared/StaggerItem";
import { kitchenStandards } from "@/features/website/chef/data";

export function KitchenStandards() {
  return (
    <Section tone="default" className="pt-0 md:pt-0 lg:pt-0">
      <Reveal>
        <p className="flex items-center gap-3 text-xs tracking-mega text-muted-foreground uppercase">
          <span className="h-px w-6 bg-primary" aria-hidden="true" />
          What the kitchen stands for
        </p>
      </Reveal>

      <StaggerGroup className="mt-10 grid divide-y divide-border border border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {kitchenStandards.map((standard) => (
          <StaggerItem key={standard.title} className="p-6">
            <h3 className="font-serif text-2xl">{standard.title}</h3>
            <p className="mt-3 text-md text-muted-foreground">{standard.description}</p>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}
