import type { ApiSuccessResponse } from "@/lib/api/core/types";
import { apiFetch } from "@/lib/api/core/client";
import type { PublicSpotlight, SpotlightPlacement } from "./types";

/** Public website: the active homepage photo cards for one spot, in display order. */
export async function fetchPublicSpotlight(
  placement: SpotlightPlacement = "hero",
): Promise<ApiSuccessResponse<PublicSpotlight[]>> {
  return apiFetch<ApiSuccessResponse<PublicSpotlight[]>>(`/spotlight?placement=${placement}`);
}
