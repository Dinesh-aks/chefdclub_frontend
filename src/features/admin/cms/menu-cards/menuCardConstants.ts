import type { MenuCardType } from "@/lib/api/menuCards";

export interface MenuCardFormState {
  menu: string;
  type: string;
  name: string;
  slug: string;
  status: boolean;
  sort: string;
  showOnHome: boolean;
}

export const EMPTY_MENU_CARD_FORM: MenuCardFormState = {
  menu: "",
  type: "12",
  name: "",
  slug: "",
  status: true,
  sort: "0",
  showOnHome: false,
};
