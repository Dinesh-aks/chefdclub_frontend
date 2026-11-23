import type { ApiSuccessResponse } from "@/lib/api/core/types";
import { adminApiFetch } from "@/lib/api/core/adminClient";
import { buildAdminListQuery, type AdminListPage, type AdminListParams } from "@/lib/api/core/adminList";
import type {
  BlogCategoryInput,
  BlogCategoryRecord,
  BlogPostFormInput,
  BlogPostListItem,
  BlogPostRecord,
} from "./types";

export async function fetchAdminBlogCategories(
  params: AdminListParams = {},
): Promise<ApiSuccessResponse<AdminListPage<BlogCategoryRecord>>> {
  return adminApiFetch<ApiSuccessResponse<AdminListPage<BlogCategoryRecord>>>(
    `/admin/journal/categories?${buildAdminListQuery(params)}`,
  );
}

export async function createAdminBlogCategory(
  input: BlogCategoryInput,
): Promise<ApiSuccessResponse<BlogCategoryRecord>> {
  return adminApiFetch<ApiSuccessResponse<BlogCategoryRecord>>("/admin/journal/categories", {
    method: "POST",
    body: input,
  });
}

export async function updateAdminBlogCategory(
  id: number,
  input: Partial<BlogCategoryInput>,
): Promise<ApiSuccessResponse<BlogCategoryRecord>> {
  return adminApiFetch<ApiSuccessResponse<BlogCategoryRecord>>(`/admin/journal/categories/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export async function deleteAdminBlogCategory(
  id: number,
): Promise<ApiSuccessResponse<{ id: number }>> {
  return adminApiFetch<ApiSuccessResponse<{ id: number }>>(`/admin/journal/categories/${id}`, {
    method: "DELETE",
  });
}

function toPostFormData(input: Partial<BlogPostFormInput>): FormData {
  const formData = new FormData();
  if (input.catId !== undefined) formData.set("catId", String(input.catId));
  if (input.author !== undefined) formData.set("author", input.author);
  if (input.title !== undefined) formData.set("title", input.title);
  if (input.slug !== undefined) formData.set("slug", input.slug);
  if (input.description !== undefined) formData.set("description", input.description);
  if (input.video !== undefined) formData.set("video", input.video);
  if (input.publishDate !== undefined) formData.set("publishDate", input.publishDate);
  if (input.seoTitle !== undefined) formData.set("seoTitle", input.seoTitle);
  if (input.seoDescription !== undefined) formData.set("seoDescription", input.seoDescription);
  if (input.status !== undefined) formData.set("status", String(input.status));
  if (input.image) formData.set("image", input.image);
  return formData;
}

export async function fetchAdminBlogPosts(
  params: AdminListParams & { catId?: number; status?: boolean } = {},
): Promise<ApiSuccessResponse<AdminListPage<BlogPostListItem>>> {
  return adminApiFetch<ApiSuccessResponse<AdminListPage<BlogPostListItem>>>(
    `/admin/journal/posts?${buildAdminListQuery(params)}`,
  );
}

export async function fetchAdminBlogPost(id: number): Promise<ApiSuccessResponse<BlogPostRecord>> {
  return adminApiFetch<ApiSuccessResponse<BlogPostRecord>>(`/admin/journal/posts/${id}`);
}

export async function createAdminBlogPost(
  input: BlogPostFormInput,
): Promise<ApiSuccessResponse<BlogPostRecord>> {
  return adminApiFetch<ApiSuccessResponse<BlogPostRecord>>("/admin/journal/posts", {
    method: "POST",
    body: toPostFormData(input),
  });
}

export async function updateAdminBlogPost(
  id: number,
  input: Partial<BlogPostFormInput>,
): Promise<ApiSuccessResponse<BlogPostRecord>> {
  return adminApiFetch<ApiSuccessResponse<BlogPostRecord>>(`/admin/journal/posts/${id}`, {
    method: "PATCH",
    body: toPostFormData(input),
  });
}

export async function deleteAdminBlogPost(id: number): Promise<ApiSuccessResponse<{ id: number }>> {
  return adminApiFetch<ApiSuccessResponse<{ id: number }>>(`/admin/journal/posts/${id}`, {
    method: "DELETE",
  });
}
