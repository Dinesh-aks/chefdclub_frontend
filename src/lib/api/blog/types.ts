export interface BlogCategoryRecord {
  id: number;
  category: string;
  slug: string;
  status: boolean;
  sort: number;
}

export interface BlogCategoryInput {
  category: string;
  slug: string;
  status: boolean;
  sort: number;
}

export interface BlogPostRecord {
  id: number;
  catId: number;
  author: string;
  title: string;
  slug: string;
  description: string;
  image: string | null;
  imageUrl: string | null;
  video: string | null;
  publishDate: string;
  seoTitle: string | null;
  seoDescription: string | null;
  status: boolean;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
}

/** A row in the admin list — the description, video and SEO fields only load on the edit page. */
export type BlogPostListItem = Omit<
  BlogPostRecord,
  "description" | "video" | "seoTitle" | "seoDescription"
> & { categoryName: string | null };

export interface BlogPostFormInput {
  catId: number;
  author: string;
  title: string;
  slug: string;
  description: string;
  video?: string;
  publishDate: string;
  seoTitle?: string;
  seoDescription?: string;
  status: boolean;
  image?: File;
}

/** A card on the public Journal list. */
export interface PublicBlogPostSummary {
  slug: string;
  title: string;
  /** Normally `yyyy-mm-dd`; legacy rows may hold other free text. */
  publishDate: string;
  excerpt: string;
  imageUrl: string | null;
  categoryName: string | null;
}

/** One full post on the public Journal article page. */
export interface PublicBlogPost extends PublicBlogPostSummary {
  author: string;
  /** Admin-authored HTML from the rich text editor. */
  description: string;
  /** YouTube video id, if the post has one. */
  video: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  likeCount: number;
}

/** A card on the Journal list: only what the card shows (no category name). */
export type PublicBlogPostCard = Pick<
  PublicBlogPostSummary,
  "slug" | "title" | "publishDate" | "excerpt" | "imageUrl"
>;

/** A "keep reading" entry on an article page: no excerpt. */
export type PublicBlogPostRelated = Pick<
  PublicBlogPostSummary,
  "slug" | "title" | "publishDate" | "imageUrl"
>;
