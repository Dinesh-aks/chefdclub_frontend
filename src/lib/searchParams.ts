type SearchParamValue = string | string[] | undefined;

/** A query-string value is a string, a list (repeated key) or missing; take the first one. */
export function firstParam(value: SearchParamValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** `?page=` as a positive whole number; anything else is page 1. */
export function parsePageParam(value: SearchParamValue): number {
  const page = Number.parseInt(firstParam(value) ?? "", 10);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

/** Builds a path with only the query values that differ from their defaults. */
export function buildHref(path: string, params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) query.set(key, String(value));
  }
  const text = query.toString();
  return text ? `${path}?${text}` : path;
}
