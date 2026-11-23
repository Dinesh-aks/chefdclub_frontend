import {
  CalendarClockIcon,
  ImageIcon,
  MailIcon,
  MessageCircleQuestionIcon,
} from "lucide-react";

export const DASHBOARD_STAT_CARDS = [
  {
    label: "Total Reservations",
    key: "reservationsThisMonth" as const,
    caption: "This month",
    href: "/admin/reservations",
    icon: CalendarClockIcon,
  },
  {
    label: "New Messages",
    key: "messagesThisMonth" as const,
    caption: "This month",
    href: "/admin/contact",
    icon: MailIcon,
  },
  {
    label: "FAQs",
    key: "faqsPublished" as const,
    caption: "Published",
    href: "/admin/cms/faqs",
    icon: MessageCircleQuestionIcon,
  },
];

export const DASHBOARD_QUICK_ACTIONS = [
  { label: "Add FAQ", href: "/admin/cms/faqs", icon: MessageCircleQuestionIcon },
  { label: "View Reservations", href: "/admin/reservations", icon: CalendarClockIcon },
  { label: "View Contact Inbox", href: "/admin/contact", icon: MailIcon },
  { label: "Manage Gallery", href: "/admin/cms/gallery", icon: ImageIcon },
];

export const DASHBOARD_PANEL_CLASS = "rounded-lg border border-border bg-card";
export const DASHBOARD_PANEL_HEADER_CLASS =
  "flex items-center justify-between border-b border-border px-3 py-2";
export const DASHBOARD_VIEW_ALL_CLASS =
  "flex items-center gap-1 text-[13px] font-medium text-primary hover:underline";

export { formatBusinessDate as formatDashboardDate, formatBusinessTime as formatDashboardTime } from "@/lib/formatDateTime";
