export type MenuCardType = 12 | 13 | 14 | 15;

export const MENU_CARD_TYPE_LABELS: Record<MenuCardType, string> = {
  12: "Breakfast",
  13: "Lunch",
  14: "Dinner",
  15: "Wine",
};

export interface MenuCardRecord {
  id: number;
  menu: number;
  type: MenuCardType;
  typeLabel: string;
  name: string;
  slug: string;
  banner: string | null;
  bannerUrl: string | null;
  status: boolean;
  sort: number;
  showOnHome: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface MenuCardFormInput {
  menu: number;
  type: MenuCardType;
  name: string;
  slug: string;
  status: boolean;
  sort: number;
  showOnHome: boolean;
  banner?: File;
}
