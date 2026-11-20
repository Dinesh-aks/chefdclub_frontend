/** Where a card shows on the homepage: beside the headline, or in the dining story section. */
export type SpotlightPlacement = "hero" | "story";

export const SPOTLIGHT_PLACEMENT_LABELS: Record<SpotlightPlacement, string> = {
  hero: "Hero (beside the headline)",
  story: "Story (dining section)",
};

/** Admin: one homepage photo card. */
export interface SpotlightRecord {
  id: number;
  title: string;
  tag: string | null;
  badge: string | null;
  placement: SpotlightPlacement;
  image: string | null;
  imageUrl: string | null;
  alt: string | null;
  status: boolean;
  sort: number;
}

export interface SpotlightFormInput {
  title: string;
  tag: string;
  badge: string;
  placement: SpotlightPlacement;
  alt: string;
  status: boolean;
  sort: number;
  image?: File;
}

/** Public website: what the homepage renders for one card. */
export interface PublicSpotlight {
  id: number;
  title: string;
  tag: string | null;
  badge: string | null;
  imageUrl: string | null;
  /** Image alt text; use the title when empty. */
  alt: string | null;
}
