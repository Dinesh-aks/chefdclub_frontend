import { redirect } from "next/navigation";

/** Legacy combined route — each page has its own admin screen now. */
export default function AdminPagesRedirectPage() {
  redirect("/admin/cms/about-us");
}
