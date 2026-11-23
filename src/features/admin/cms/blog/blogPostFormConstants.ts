export interface BlogPostFormState {
  catId: string;
  author: string;
  title: string;
  slug: string;
  description: string;
  video: string;
  publishDate: string;
  seoTitle: string;
  seoDescription: string;
  status: boolean;
}

export const EMPTY_BLOG_POST_FORM: BlogPostFormState = {
  catId: "",
  author: "",
  title: "",
  slug: "",
  description: "",
  video: "",
  publishDate: "",
  seoTitle: "",
  seoDescription: "",
  status: true,
};
