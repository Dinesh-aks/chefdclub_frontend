export type FaqCategory = "veg" | "non-veg" | "wine-pairing";

export interface FaqRecord {
  id: number;
  question: string;
  answer: string;
  sort: number;
  status: boolean;
  category: FaqCategory;
}

/** A row in the admin list — the answer HTML is only loaded on the edit page. */
export type FaqListItem = Omit<FaqRecord, "answer">;

export interface FaqInput {
  question: string;
  answer: string;
  sort: number;
  status: boolean;
  category: FaqCategory;
}
