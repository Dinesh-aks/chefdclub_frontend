const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
/** The backend origin, e.g. `http://localhost:5000` — `imageUrl` comes back as a
 * relative `/uploads/...` path, while `NEXT_PUBLIC_API_URL` includes the `/api` suffix. */
const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

/** Resolves a relative `/uploads/...` path from the backend into an absolute URL. */
export function toGalleryAssetUrl(path: string): string {
  return `${API_ORIGIN}${path}`;
}
