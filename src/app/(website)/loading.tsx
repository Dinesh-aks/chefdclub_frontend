import { InkDots } from "@/components/shared/InkDots";
import { Section } from "@/components/shared/Section";

/** Shown inside the website layout (header/footer stay put) while a page's server data loads. */
export default function WebsiteLoading() {
  return (
    <Section tone="ink" className="min-h-[60vh]">
      <div role="status" aria-live="polite" className="flex justify-center">
        <InkDots label="Loading" />
      </div>
    </Section>
  );
}
