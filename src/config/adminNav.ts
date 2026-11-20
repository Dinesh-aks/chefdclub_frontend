import {
  BookOpenIcon,
  CalendarClockIcon,
  FileTextIcon,
  FolderCogIcon,
  ImageIcon,
  LayoutDashboardIcon,
  MailIcon,
  MessageCircleQuestionIcon,
  Share2Icon,
  SettingsIcon,
  StarIcon,
  TagsIcon,
  UtensilsIcon,
  VideoIcon,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavLeaf {
  href: string;
  label: string;
  exact: boolean;
  icon: LucideIcon;
}

export interface AdminNavGroup {
  label: string;
  icon: LucideIcon;
  children: AdminNavEntry[];
}

export type AdminNavEntry = AdminNavLeaf | AdminNavGroup;

export function isAdminNavGroup(entry: AdminNavEntry): entry is AdminNavGroup {
  return "children" in entry;
}

export function flattenAdminNavLeaves(entries: AdminNavEntry[]): AdminNavLeaf[] {
  return entries.flatMap((entry) =>
    isAdminNavGroup(entry) ? flattenAdminNavLeaves(entry.children) : [entry],
  );
}

/** Shown in the sidebar. */
export const adminNavItems: AdminNavEntry[] = [
  { href: "/admin", label: "Dashboard", exact: true, icon: LayoutDashboardIcon },
  { href: "/admin/reservations", label: "Reservations", exact: false, icon: CalendarClockIcon },
  { href: "/admin/contact", label: "Contact Inbox", exact: false, icon: MailIcon },
  {
    label: "CMS",
    icon: FolderCogIcon,
    children: [
      { href: "/admin/cms/faqs", label: "FAQs", exact: false, icon: MessageCircleQuestionIcon },
      { href: "/admin/cms/about-us", label: "About Us", exact: true, icon: FileTextIcon },
      { href: "/admin/cms/privacy-policy", label: "Privacy Policy", exact: true, icon: FileTextIcon },
      {
        href: "/admin/cms/terms-and-conditions",
        label: "Terms & Conditions",
        exact: true,
        icon: FileTextIcon,
      },
      {
        label: "Gallery",
        icon: ImageIcon,
        children: [
          {
            href: "/admin/cms/gallery/photos",
            label: "Photos",
            exact: false,
            icon: ImageIcon,
          },
          {
            href: "/admin/cms/gallery/videos",
            label: "Videos",
            exact: false,
            icon: VideoIcon,
          },
        ],
      },
      { href: "/admin/cms/spotlight", label: "Homepage Photo Cards", exact: false, icon: StarIcon },
      {
        label: "Menu",
        icon: UtensilsIcon,
        children: [
          {
            href: "/admin/cms/menu-categories",
            label: "Menu Categories",
            exact: false,
            icon: UtensilsIcon,
          },
          {
            href: "/admin/cms/menu-cards",
            label: "Menu Photo Cards",
            exact: false,
            icon: ImageIcon,
          },
        ],
      },
      {
        label: "Journal",
        icon: BookOpenIcon,
        children: [
          {
            href: "/admin/cms/journal/posts",
            label: "Posts",
            exact: false,
            icon: BookOpenIcon,
          },
          {
            href: "/admin/cms/journal/categories",
            label: "Categories",
            exact: false,
            icon: TagsIcon,
          },
        ],
      },
      { href: "/admin/cms/social-links", label: "Social Links", exact: false, icon: Share2Icon },
    ],
  },
];

/** Pinned to the bottom of the sidebar, below the primary nav list. */
export const adminBottomNavItems: AdminNavLeaf[] = [
  { href: "/admin/settings", label: "Settings", exact: false, icon: SettingsIcon },
];

/** Every admin leaf page that exists — used to resolve the header's page title. */
export const allAdminNavItems: AdminNavLeaf[] = [
  ...adminNavItems.flatMap((entry) =>
    isAdminNavGroup(entry) ? flattenAdminNavLeaves(entry.children) : [entry],
  ),
  ...adminBottomNavItems,
];
