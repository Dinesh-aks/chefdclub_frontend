export { MenuCategoryPage as default } from "@/features/website/menus/MenuCategoryPage";

// Content comes from the CMS, so render on every request instead of freezing it at build time.
export const revalidate = 60;
