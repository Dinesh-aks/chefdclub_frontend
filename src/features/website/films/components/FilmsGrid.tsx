import { redirect } from "next/navigation";
import { fetchFilms, type FilmCategory } from "@/lib/api/films";
import { FilmsGridClient } from "@/features/website/films/components/FilmsGridClient";
import { FILMS_PER_PAGE, filmsHref } from "@/features/website/films/data";

interface FilmsGridProps {
  category: FilmCategory;
  page: number;
}

/** Asks the API for just this category's page of films. */
export async function FilmsGrid({ category, page }: FilmsGridProps) {
  const result = await fetchFilms({ category, page, limit: FILMS_PER_PAGE })
    .then((response) => response.data)
    .catch(() => null);

  if (!result) {
    return <p className="mt-10 text-muted-foreground">Films are unavailable right now.</p>;
  }

  // A page past the end (e.g. an old link) goes to the last real page.
  if (page > result.totalPages) {
    redirect(filmsHref(category, result.totalPages));
  }

  if (!result.items.length) {
    return <p className="mt-10 text-muted-foreground">No films here yet.</p>;
  }

  return (
    <FilmsGridClient
      videos={result.items}
      category={category}
      page={result.page}
      totalPages={result.totalPages}
    />
  );
}
