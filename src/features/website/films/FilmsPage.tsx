import { Suspense } from "react";
import { InkDots } from "@/components/shared/InkDots";
import { Section } from "@/components/shared/Section";
import { parsePageParam } from "@/lib/searchParams";
import { FilmsCta } from "@/features/website/films/components/FilmsCta";
import { FilmsFilterTabs } from "@/features/website/films/components/FilmsFilterTabs";
import { FilmsGrid } from "@/features/website/films/components/FilmsGrid";
import { FilmsHero } from "@/features/website/films/components/FilmsHero";
import { parseFilmCategory } from "@/features/website/films/data";

/** The category and page live in the URL, so every tab or page is a fresh request for just that data. */
export async function FilmsPage({ searchParams }: PageProps<"/films">) {
  const params = await searchParams;
  const category = parseFilmCategory(params.category);
  const page = parsePageParam(params.page);

  return (
    <>
      <FilmsHero />
      <Section tone="default" padding="afterHero">
        <FilmsFilterTabs activeSlug={category} />
        <Suspense
          key={`${category}-${page}`}
          fallback={
            <div className="mt-10">
              <InkDots label="Loading films" />
            </div>
          }
        >
          <FilmsGrid category={category} page={page} />
        </Suspense>
      </Section>
      <FilmsCta />
    </>
  );
}
