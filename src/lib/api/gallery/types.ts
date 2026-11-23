export type GalleryPhotoCategory = "all" | "veg" | "non-veg";

export interface GalleryPhotoRecord {
  id: number;
  name: string | null;
  image: string;
  imageUrl: string;
  category: GalleryPhotoCategory;
}

export interface GalleryPhotoFormInput {
  name?: string;
  category: GalleryPhotoCategory;
  image?: File;
}

export type GalleryVideoCategory = "all" | "veg" | "non-veg" | "private-dining";

export type GalleryVideoPlatform = "youtube" | "facebook" | "unknown";

export interface GalleryVideoRecord {
  id: number;
  category: GalleryVideoCategory;
  addDate: string;
  platform: GalleryVideoPlatform;
  embedUrl: string | null;
  thumbnailUrl: string | null;
}

/** Admin by-id shape: also carries the stored link or embed code. */
export interface GalleryVideoDetail extends GalleryVideoRecord {
  source: string;
}

/** Public website: what a gallery card shows. `imageUrl` is a relative "/uploads/..." path. */
export interface PublicGalleryPhoto {
  id: number;
  name: string | null;
  imageUrl: string;
}
