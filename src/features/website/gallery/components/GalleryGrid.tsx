import { redirect } from "next/navigation";
import { CaptionedImage } from "@/components/shared/CaptionedImage";
import { Pagination } from "@/components/shared/Pagination";
import { StaggerGroup } from "@/components/shared/StaggerGroup";
import { StaggerItem } from "@/components/shared/StaggerItem";
import { GALLERY_PHOTOS_PER_PAGE, galleryHref } from "@/features/website/gallery/data";
import { fetchGalleryPhotos, toGalleryAssetUrl, type GalleryPhotoCategory } from "@/lib/api/gallery";

interface GalleryGridProps {
  category: GalleryPhotoCategory;
  page: number;
}

/** Asks the API for just this category's page of photos. */
export async function GalleryGrid({ category, page }: GalleryGridProps) {
  const result = await fetchGalleryPhotos({ category, page, limit: GALLERY_PHOTOS_PER_PAGE })
    .then((response) => response.data)
    .catch(() => null);

  if (!result) {
    return <p className="mt-10 text-muted-foreground">Photos are unavailable right now.</p>;
  }

  // A page past the end (e.g. an old link) goes to the last real page.
  if (page > result.totalPages) {
    redirect(galleryHref(category, result.totalPages));
  }

  if (!result.items.length) {
    return <p className="mt-10 text-muted-foreground">No photos here yet.</p>;
  }

  return (
    <>
      <StaggerGroup className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {result.items.map((photo, index) => (
          <StaggerItem key={photo.id}>
            <CaptionedImage
              src={toGalleryAssetUrl(photo.imageUrl)}
              alt={photo.name ?? "Gallery photo"}
              title={photo.name ?? undefined}
              priority={index === 0}
              captionOnHover
            />
          </StaggerItem>
        ))}
      </StaggerGroup>

      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        hrefBase={{ path: "/gallery", params: { category: category === "all" ? undefined : category } }}
      />
    </>
  );
}
