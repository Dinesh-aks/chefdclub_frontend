import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { fetchHomeFaqs } from "@/lib/api/faq";

export async function Faq() {
  const faqs = await fetchHomeFaqs()
    .then((response) => response.data)
    .catch(() => []);

  if (faqs.length === 0) {
    return null;
  }

  return (
    <Section tone="default" className="pt-0 md:pt-0 lg:pt-0">
      <Reveal className="mx-auto max-w-4xl">
        <p className="flex items-center justify-center gap-3 text-[12px] tracking-mega text-muted-foreground uppercase">
          <span className="h-px w-6 bg-primary" aria-hidden="true" />
          Good to Know
          <span className="h-px w-6 bg-primary" aria-hidden="true" />
        </p>

        <Accordion type="single" collapsible className="mt-8">
          {faqs.map((item) => (
            <AccordionItem key={item.id} value={String(item.id)}>
              <AccordionTrigger className="font-serif text-xl">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                <div
                  className="[&_p]:mb-3 last:[&_p]:mb-0"
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </Section>
  );
}
