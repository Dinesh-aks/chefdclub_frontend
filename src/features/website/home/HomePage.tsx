import { ChefQuote } from "@/features/website/home/components/ChefQuote";
import { ClosingCta } from "@/features/website/home/components/ClosingCta";
import { CourseStructure } from "@/features/website/home/components/CourseStructure";
import { DiningFormats } from "@/features/website/home/components/DiningFormats";
import { DiningStory } from "@/features/website/home/components/DiningStory";
import { Faq } from "@/features/website/home/components/Faq";
import { GalleryHighlights } from "@/features/website/home/components/GalleryHighlights";
import { Hero } from "@/features/website/home/components/Hero";
import { HowItWorks } from "@/features/website/home/components/HowItWorks";

export function HomePage() {
  return (
    <>
      <Hero />
      <DiningStory />
      <DiningFormats />
      <CourseStructure />
      <GalleryHighlights />
      <ChefQuote />
      <HowItWorks />
      <Faq />
      <ClosingCta />
    </>
  );
}
