import { redirect } from "next/navigation";

// The old single Gallery page is now split into Photos and Videos; keep old links working.
export default function AdminGalleryPage() {
  redirect("/admin/cms/gallery/photos");
}
