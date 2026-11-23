import type { ApiSuccessResponse } from "@/lib/api/core/types";
import { apiFetch } from "@/lib/api/core/client";
import type { SocialLinkRecord } from "./types";

/** Public: social profiles configured in admin CMS. */
export async function fetchSocialLinks(): Promise<ApiSuccessResponse<SocialLinkRecord[]>> {
  return apiFetch<ApiSuccessResponse<SocialLinkRecord[]>>("/social-links");
}

