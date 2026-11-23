const API_URL = process.env.NEXT_PUBLIC_API_URL;
// CMS edits show on the public site within this many seconds.
const PUBLIC_REVALIDATE_SECONDS = 60;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

// Dev only, and only on the Next.js server: calls made there never show in the browser's Network
// tab, so they are recorded for the debug panel instead. Loaded lazily so it never reaches the browser.
// Set API_DEBUG=false in .env to turn it off.
async function beginDevLog(method: string, url: string, body: unknown) {
  if (typeof window !== "undefined" || process.env.NODE_ENV === "production") return null;
  if (process.env.API_DEBUG === "false") return null;
  const { beginApiCall } = await import("./devApiLog");
  return beginApiCall(method, url, body);
}

export async function apiFetch<TResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const { body, headers, ...rest } = options;
  const isFormData = body instanceof FormData;

  const finishDevLog = await beginDevLog(rest.method ?? "GET", `${API_URL}${path}`, body);

  // Public GETs rendered on the Next.js server are cached briefly, so most page views skip the
  // backend round trip. Admin/credentialed calls, POSTs and calls that set their own cache stay live.
  const isPublicGet =
    (rest.method ?? "GET") === "GET" &&
    !rest.credentials &&
    rest.cache === undefined &&
    !("next" in rest);

  const send = () =>
    fetch(`${API_URL}${path}`, {
      ...(isPublicGet ? { next: { revalidate: PUBLIC_REVALIDATE_SECONDS } } : {}),
      ...rest,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });

  let response: Response;
  try {
    try {
      response = await send();
    } catch (firstError) {
      // A brief network blip ("fetch failed") is common; reads are safe to retry once.
      if ((rest.method ?? "GET") !== "GET") throw firstError;
      response = await send();
    }
  } catch (error) {
    finishDevLog?.(0, String(error));
    throw error;
  }

  const contentType = response.headers.get("content-type");
  const data = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();
  finishDevLog?.(response.status, data);

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
        ? (data as { message: string }).message
        : response.statusText;
    throw new ApiError(message, response.status, data);
  }

  return data as TResponse;
}
