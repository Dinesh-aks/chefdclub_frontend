export interface NavItem {
  label: string;
  href: string;
  /** Sub-links shown in a dropdown under this nav item, e.g. Menus. */
  children?: NavItem[];
}

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Menus",
    href: "/menus",
    children: [
      { label: "Vegetarian", href: "/menus/vegetarian" },
      { label: "Non-vegetarian", href: "/menus/non-vegetarian" },
      // The legacy menu category slug really is spelled "wine-paring".
      { label: "Wine Pairing", href: "/menus/wine-paring" },
    ],
  },
  { label: "Gallery", href: "/gallery" },
  { label: "Films", href: "/films" },
  { label: "The Chef", href: "/chef" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

export const reserveNavItem: NavItem = {
  label: "Reserve a Date",
  href: "/reserve",
};

export interface FooterNavGroup {
  title: string;
  items: NavItem[];
}

export const footerNav: FooterNavGroup[] = [
  {
    title: "Explore",
    items: [
      { label: "Home", href: "/" },
      { label: "The Chef", href: "/chef" },
      { label: "Menus", href: "/menus" },
      { label: "Gallery", href: "/gallery" },
      { label: "Films", href: "/films" },
      { label: "Journal", href: "/journal" },
    ],
  },
];
