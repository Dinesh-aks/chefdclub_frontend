import type { ApiSuccessResponse } from "@/lib/api/core/types";
import { adminApiFetch } from "@/lib/api/core/adminClient";
import { buildAdminListQuery, type AdminListPage, type AdminListParams } from "@/lib/api/core/adminList";
import type {
  GalleryPhotoCategory,
  GalleryPhotoFormInput,
  GalleryPhotoRecord,
  GalleryVideoCategory,
  GalleryVideoDetail,
  GalleryVideoRecord,
} from "./types";

/** Admin: every gallery photo, any category (including non-image rows the public list excludes). */
export async function fetchAdminGalleryPhotos(
  params: AdminListParams & { category?: GalleryPhotoCategory } = {},
): Promise<ApiSuccessResponse<AdminListPage<GalleryPhotoRecord>>> {
  return adminApiFetch<ApiSuccessResponse<AdminListPage<GalleryPhotoRecord>>>(
    `/admin/gallery/photos?${buildAdminListQuery(params)}`,
  );
}

export async function fetchAdminGalleryPhoto(id: number): Promise<ApiSuccessResponse<GalleryPhotoRecord>> {
  return adminApiFetch<ApiSuccessResponse<GalleryPhotoRecord>>(`/admin/gallery/photos/${id}`);
}

function toPhotoFormData(input: GalleryPhotoFormInput): FormData {
  const formData = new FormData();
  if (input.name) formData.set("name", input.name);
  formData.set("category", input.category);
  if (input.image) formData.set("image", input.image);
  return formData;
}

export async function createAdminGalleryPhoto(
  input: GalleryPhotoFormInput & { image: File },
): Promise<ApiSuccessResponse<GalleryPhotoRecord>> {
  return adminApiFetch<ApiSuccessResponse<GalleryPhotoRecord>>("/admin/gallery/photos", {
    method: "POST",
    body: toPhotoFormData(input),
  });
}

export async function updateAdminGalleryPhoto(
  id: number,
  input: GalleryPhotoFormInput,
): Promise<ApiSuccessResponse<GalleryPhotoRecord>> {
  return adminApiFetch<ApiSuccessResponse<GalleryPhotoRecord>>(`/admin/gallery/photos/${id}`, {
    method: "PATCH",
    body: toPhotoFormData(input),
  });
}

export async function deleteAdminGalleryPhoto(id: number): Promise<ApiSuccessResponse<{ id: number }>> {
  return adminApiFetch<ApiSuccessResponse<{ id: number }>>(`/admin/gallery/photos/${id}`, {
    method: "DELETE",
  });
}

export async function fetchAdminGalleryVideos(
  params: AdminListParams & { category?: GalleryVideoCategory } = {},
): Promise<ApiSuccessResponse<AdminListPage<GalleryVideoRecord>>> {
  return adminApiFetch<ApiSuccessResponse<AdminListPage<GalleryVideoRecord>>>(
    `/admin/gallery/videos?${buildAdminListQuery(params)}`,
  );
}

export async function createAdminGalleryVideo(input: {
  category: GalleryVideoCategory;
  source: string;
}): Promise<ApiSuccessResponse<GalleryVideoRecord>> {
  return adminApiFetch<ApiSuccessResponse<GalleryVideoRecord>>("/admin/gallery/videos", {
    method: "POST",
    body: input,
  });
}

/** Admin: one video with its stored link or embed code, for the edit form. */
export async function fetchAdminGalleryVideo(
  id: number,
): Promise<ApiSuccessResponse<GalleryVideoDetail>> {
  return adminApiFetch<ApiSuccessResponse<GalleryVideoDetail>>(`/admin/gallery/videos/${id}`);
}

export async function updateAdminGalleryVideo(
  id: number,
  input: { category?: GalleryVideoCategory; source?: string },
): Promise<ApiSuccessResponse<GalleryVideoDetail>> {
  return adminApiFetch<ApiSuccessResponse<GalleryVideoDetail>>(`/admin/gallery/videos/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export async function deleteAdminGalleryVideo(id: number): Promise<ApiSuccessResponse<{ id: number }>> {
  return adminApiFetch<ApiSuccessResponse<{ id: number }>>(`/admin/gallery/videos/${id}`, {
    method: "DELETE",
  });
}
