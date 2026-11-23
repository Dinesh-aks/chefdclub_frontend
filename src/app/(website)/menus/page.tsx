import { MenusPage } from "@/features/website/menus/MenusPage";

// Content comes from the CMS, so render on every request instead of freezing it at build time.
export const revalidate = 60;

export default MenusPage;
