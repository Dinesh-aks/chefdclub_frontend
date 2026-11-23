import { notFound } from "next/navigation";
import { GalleryVideoForm } from "@/features/admin/cms/gallery/GalleryVideoForm";

export default async function AdminEditGalleryVideoPage({
  params,
}: PageProps<"/admin/cms/gallery/videos/[id]/edit">) {
  const { id } = await params;
  const videoId = Number.parseInt(id, 10);

  if (!Number.isFinite(videoId)) {
    notFound();
  }

  return <GalleryVideoForm videoId={videoId} />;
}
