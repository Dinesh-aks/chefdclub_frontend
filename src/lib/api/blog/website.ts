import type { ApiSuccessResponse } from "@/lib/api/core/types";
import { apiFetch } from "@/lib/api/core/client";
import type { AdminListPage } from "@/lib/api/core/adminList";
import type { PublicBlogPost, PublicBlogPostSummary } from "./types";

/** Fields the Journal list cards show; asked for explicitly so the backend skips the rest. */
export const JOURNAL_CARD_FIELDS = ["slug", "title", "publishDate", "excerpt", "imageUrl"] as const;

/** Fields a "keep reading" entry shows (no excerpt, so the backend never reads the post body). */
export const JOURNAL_RELATED_FIELDS = ["slug", "title", "publishDate", "imageUrl"] as const;

/** Public website: active Journal posts, newest first. `fields` limits what each row contains. */
export async function fetchPublicBlogPosts<K extends keyof PublicBlogPostSummary = keyof PublicBlogPostSummary>(
  params: {
    page?: number;
    limit?: number;
    /** Leave this post out (used for "more from the journal"). */
    exclude?: string;
    /** Only these fields are returned per post; omit for all. */
    fields?: readonly K[];
  } = {},
): Promise<ApiSuccessResponse<AdminListPage<Pick<PublicBlogPostSummary, K>>>> {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 30),
  });
  if (params.exclude) query.set("exclude", params.exclude);
  if (params.fields?.length) query.set("fields", params.fields.join(","));
  return apiFetch<ApiSuccessResponse<AdminListPage<Pick<PublicBlogPostSummary, K>>>>(`/journal/posts?${query}`);
}

/** Public website: one active post by slug (404 when missing or inactive). */
export async function fetchPublicBlogPost(slug: string): Promise<ApiSuccessResponse<PublicBlogPost>> {
  return apiFetch<ApiSuccessResponse<PublicBlogPost>>(`/journal/posts/${encodeURIComponent(slug)}`);
}

/** Counts one read of a post. Call it from the reader's browser so the visitor's IP is recorded. */
export async function recordPublicBlogView(slug: string): Promise<void> {
  await apiFetch(`/journal/posts/${encodeURIComponent(slug)}/view`, { method: "POST" });
}

export interface BlogLikeState {
  count: number;
  liked: boolean;
}

/** Like count, and whether this visitor has already liked the post. */
export async function fetchPublicBlogLike(slug: string): Promise<ApiSuccessResponse<BlogLikeState>> {
  return apiFetch<ApiSuccessResponse<BlogLikeState>>(`/journal/posts/${encodeURIComponent(slug)}/like`);
}

/** Like or unlike a post; returns the new state. */
export async function togglePublicBlogLike(slug: string): Promise<ApiSuccessResponse<BlogLikeState>> {
  return apiFetch<ApiSuccessResponse<BlogLikeState>>(`/journal/posts/${encodeURIComponent(slug)}/like`, {
    method: "POST",
  });
}
