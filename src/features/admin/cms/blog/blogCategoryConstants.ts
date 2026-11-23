export interface BlogCategoryFormState {
  category: string;
  slug: string;
  status: boolean;
  sort: string;
}

export const EMPTY_BLOG_CATEGORY_FORM: BlogCategoryFormState = {
  category: "",
  slug: "",
  status: true,
  sort: "1",
};
