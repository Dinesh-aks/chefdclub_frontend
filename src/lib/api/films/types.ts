export type FilmCategory = "all" | "veg" | "non-veg" | "private-dining";

export type FilmPlatform = "youtube" | "facebook" | "unknown";

/** Public website: what a film card and its player need. */
export interface Film {
  id: number;
  category: FilmCategory;
  platform: FilmPlatform;
  embedUrl: string | null;
  thumbnailUrl: string | null;
}
