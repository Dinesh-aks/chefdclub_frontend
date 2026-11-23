export interface MenuCategoryFormState {
  name: string;
  status: boolean;
  sort: string;
}

export const EMPTY_MENU_CATEGORY_FORM: MenuCategoryFormState = {
  name: "",
  status: true,
  sort: "0",
};
