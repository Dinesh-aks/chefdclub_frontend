/** Distinct icon colors in the admin sidebar (semantic / brand-adjacent). */
const NAV_ICON_BY_HREF: Record<string, string> = {
  "/admin": "text-sky-600",
  "/admin/reservations": "text-violet-600",
  "/admin/contact": "text-blue-600",
  "/admin/cms/faqs": "text-amber-600",
  "/admin/cms/about-us": "text-stone-600",
  "/admin/cms/privacy-policy": "text-stone-600",
  "/admin/cms/terms-and-conditions": "text-stone-600",
  "/admin/cms/gallery/photos": "text-emerald-600",
  "/admin/cms/gallery/videos": "text-red-500",
  "/admin/cms/spotlight": "text-pink-500",
  "/admin/cms/highlights": "text-amber-500",
  "/admin/cms/menu-categories": "text-orange-600",
  "/admin/cms/menu-cards": "text-rose-600",
  "/admin/cms/journal/posts": "text-indigo-600",
  "/admin/cms/journal/categories": "text-purple-600",
  "/admin/cms/social-links": "text-[#1877F2]",
  "/admin/settings": "text-zinc-600",
};

const NAV_ICON_BY_GROUP_LABEL: Record<string, string> = {
  CMS: "text-slate-600",
  Gallery: "text-emerald-600",
  Menu: "text-orange-600",
  Journal: "text-indigo-600",
};

export function getAdminNavIconClass(options: { href?: string; groupLabel?: string }): string {
  // Indexed lookups may be undefined, so fall through href -> group -> default with `??`.
  const byHref = options.href ? NAV_ICON_BY_HREF[options.href] : undefined;
  const byGroup = options.groupLabel ? NAV_ICON_BY_GROUP_LABEL[options.groupLabel] : undefined;
  return byHref ?? byGroup ?? "text-muted-foreground";
}
