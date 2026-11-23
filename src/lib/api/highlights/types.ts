export interface HighlightRecord {
  id: number;
  name: string | null;
  description: string | null;
  image: string | null;
  imageUrl: string | null;
  status: boolean;
  sort: number;
}

export interface HighlightFormInput {
  name?: string;
  description?: string;
  status: boolean;
  sort: number;
  image?: File;
}
