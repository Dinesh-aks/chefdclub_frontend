"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/core/client";
import {
  createAdminGalleryPhoto,
  fetchAdminGalleryPhoto,
  toGalleryAssetUrl,
  updateAdminGalleryPhoto,
  type GalleryPhotoCategory,
  type GalleryPhotoRecord,
} from "@/lib/api/gallery";
import { AdminFileInput } from "@/components/admin/AdminFileInput";
import { FormActions } from "@/components/admin/FormActions";
import { FormSection } from "@/components/admin/FormSection";
import { InkDots } from "@/components/shared/InkDots";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GALLERY_PHOTO_CATEGORIES,
  GALLERY_PHOTO_CATEGORY_LABELS,
} from "@/features/admin/cms/gallery/galleryPhotoConstants";

interface GalleryPhotoFormProps {
  photoId?: number;
}

export function GalleryPhotoForm({ photoId }: GalleryPhotoFormProps) {
  const router = useRouter();
  const editing = photoId !== undefined;

  const [photo, setPhoto] = useState<GalleryPhotoRecord | null>(null);
  const [loading, setLoading] = useState(editing);
  const [loadError, setLoadError] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<GalleryPhotoCategory>("all");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) return;

    let cancelled = false;

    async function load() {
      try {
        const response = await fetchAdminGalleryPhoto(photoId!);
        if (cancelled) return;
        const record = response.data;
        setPhoto(record);
        setName(record.name ?? "");
        setCategory(record.category);
        setLoadError("");
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof ApiError ? err.message : "Could not load this photo.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [photoId, editing]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const image = imageInputRef.current?.files?.[0];
    if (!editing && !image) {
      const message = "An image is required.";
      setFormError(message);
      toast.error(message);
      return;
    }

    setSubmitting(true);
    try {
      if (editing) {
        await updateAdminGalleryPhoto(photoId, { name: name || undefined, category, image });
        toast.success("Photo saved", { description: name.trim() || undefined });
      } else {
        await createAdminGalleryPhoto({ name: name || undefined, category, image: image! });
        toast.success("Photo added", { description: name.trim() || undefined });
      }
      router.push("/admin/cms/gallery/photos");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not save this photo.";
      toast.error(message);
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <header className="mb-5 space-y-3">
        <Link
          href="/admin/cms/gallery/photos"
          className="inline-flex items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeftIcon className="size-4 shrink-0" aria-hidden="true" />
          Gallery Photos
        </Link>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{editing ? "Edit Photo" : "Add Photo"}</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {editing ? "Update this gallery photo" : "Add a photo to the public Photo Gallery"}
          </p>
        </div>
      </header>

      {loading ? (
        <InkDots label="Loading" />
      ) : (
        <form onSubmit={handleSubmit}>
          {loadError ? <p className="mb-4 text-sm text-destructive">{loadError}</p> : null}

          {/* Few fields, so one roomy card: a big image area on the left, the details beside it. */}
          <div className="grid grid-cols-1 gap-8 rounded-lg border border-border bg-card p-6 shadow-sm lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-10">
            <FormSection
              title="Image"
              description={
                editing
                  ? "Optional. A new upload replaces the current image when you save."
                  : "Required. Upload the photo to show in the gallery."
              }
            >
              <AdminFileInput
                id="photo-image"
                inputRef={imageInputRef}
                currentImageUrl={photo ? toGalleryAssetUrl(photo.imageUrl) : null}
                currentImageAlt={name.trim() || "Gallery photo"}
                className="flex-col items-stretch"
                large
              />
            </FormSection>

            <div className="lg:border-l lg:border-border lg:pl-10">
              <FormSection title="Photo Details" description="Name and the gallery tab this photo appears under.">
                <div className="grid gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="photo-name">Name</Label>
                    <Input
                      id="photo-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="e.g. Layered baked cod & prawn biryani"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="photo-category" required>Category</Label>
                    <Select
                      value={category}
                      onValueChange={(value) => setCategory(value as GalleryPhotoCategory)}
                    >
                      <SelectTrigger id="photo-category" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GALLERY_PHOTO_CATEGORIES.map((value) => (
                          <SelectItem key={value} value={value}>
                            {GALLERY_PHOTO_CATEGORY_LABELS[value]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      &ldquo;All&rdquo; shows the photo under every tab of the public gallery.
                    </p>
                  </div>
                </div>
              </FormSection>
            </div>
          </div>

          <FormActions error={formError}>
            <Button type="button" variant="outline" asChild className="sm:min-w-[5.5rem]">
              <Link href="/admin/cms/gallery/photos">Cancel</Link>
            </Button>
            <Button type="submit" disabled={submitting || Boolean(loadError)} className="sm:min-w-[5.5rem]">
              {submitting ? "Saving…" : editing ? "Save photo" : "Add photo"}
            </Button>
          </FormActions>
        </form>
      )}
    </div>
  );
}
