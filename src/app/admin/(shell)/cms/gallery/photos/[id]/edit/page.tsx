import { notFound } from "next/navigation";
import { GalleryPhotoForm } from "@/features/admin/cms/gallery/GalleryPhotoForm";

export default async function AdminEditGalleryPhotoPage({
  params,
}: PageProps<"/admin/cms/gallery/photos/[id]/edit">) {
  const { id } = await params;
  const photoId = Number.parseInt(id, 10);

  if (!Number.isFinite(photoId)) {
    notFound();
  }

  return <GalleryPhotoForm photoId={photoId} />;
}
