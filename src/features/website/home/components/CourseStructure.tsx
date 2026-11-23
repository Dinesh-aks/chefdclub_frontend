import { Heading } from "@/components/shared/Heading";
import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { StaggerGroup } from "@/components/shared/StaggerGroup";
import { StaggerItem } from "@/components/shared/StaggerItem";
import { courseStructure } from "@/features/website/home/data";

export function CourseStructure() {
  return (
    <Section tone="default" className="pt-0 md:pt-0 lg:pt-0">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <Reveal>
          <Heading eyebrow="The structure of an evening">
            A minimum of four courses
          </Heading>
        </Reveal>
        <Reveal className="max-w-sm text-sm text-muted-foreground">
          Menus are written per booking. This is the shape every evening follows; the dishes
          change with the season and the table.
        </Reveal>
      </div>

      <StaggerGroup className="mt-10 grid gap-8 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-border">
        {courseStructure.map((course) => (
          <StaggerItem key={course.order} className="lg:px-8 lg:first:pl-0">
            <p className="text-xs tracking-mega text-primary uppercase">{course.order}</p>
            <h3 className="mt-2 font-serif text-lg">{course.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{course.description}</p>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}
