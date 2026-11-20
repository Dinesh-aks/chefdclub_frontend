import { ApiError, apiFetch } from "@/lib/api/core/client";

type AdminRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

let refreshInFlight: Promise<void> | null = null;

/** Asks the backend for a new access cookie using the refresh cookie. Concurrent callers share one request. */
function refreshAdminSession(): Promise<void> {
  refreshInFlight ??= apiFetch("/admin/auth/refresh", { method: "POST", credentials: "include" })
    .then(() => undefined)
    .finally(() => {
      refreshInFlight = null;
    });
  return refreshInFlight;
}

/**
 * Admin calls authenticate with httpOnly session cookies set by the backend on login.
 * If the short-lived access cookie has expired (401), the session is refreshed once and the call retried.
 */
export async function adminApiFetch<TResponse>(
  path: string,
  options: AdminRequestOptions = {},
): Promise<TResponse> {
  const request = () => apiFetch<TResponse>(path, { ...options, credentials: "include" });

  try {
    return await request();
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) {
      throw error;
    }
    try {
      await refreshAdminSession();
    } catch {
      throw error;
    }
    return request();
  }
}
