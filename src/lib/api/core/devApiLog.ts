import { cache } from "react";

/**
 * Dev only. Records the API calls made while one page is rendered on the Next.js server, so the
 * debug panel (`ApiDebugBar`) can show them. Those calls never appear in the browser's Network tab.
 */

export interface DevApiCall {
  id: number;
  method: string;
  /** The full request URL, including the API origin and any query string. */
  url: string;
  /** 0 when the request failed before getting a response. */
  status: number;
  ms: number;
  sent: unknown;
  got: unknown;
}

interface DevApiStore {
  calls: DevApiCall[];
  inflight: number;
}

// Bodies are shown in full. Set API_DEBUG_FULL=false in .env to cut long lists and strings instead
// (the recorded calls travel inside the page's HTML, so very large responses make it heavy).
const TRUNCATE = process.env.API_DEBUG_FULL === "false";
const MAX_ARRAY_ITEMS = 5;
const MAX_STRING_LENGTH = 300;

// `cache` gives one store per server request, shared by every component rendered for that page.
const getStore = cache((): DevApiStore => ({ calls: [], inflight: 0 }));

/** Prepares a body for display: passwords/tokens hidden, and long lists/strings cut when truncating. */
function slim(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (value instanceof FormData) return `FormData(${[...value.keys()].join(", ")})`;
  if (Array.isArray(value)) {
    if (!TRUNCATE) return value.map(slim);
    const head = value.slice(0, MAX_ARRAY_ITEMS).map(slim);
    if (value.length > MAX_ARRAY_ITEMS) head.push(`… +${value.length - MAX_ARRAY_ITEMS} more items`);
    return head;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, /password|token/i.test(key) ? "***" : slim(item)]),
    );
  }
  if (TRUNCATE && typeof value === "string" && value.length > MAX_STRING_LENGTH) {
    return `${value.slice(0, MAX_STRING_LENGTH)}… (${value.length} chars)`;
  }
  return value;
}

/** Call before the request starts; the returned function records the result when it ends. */
export function beginApiCall(method: string, url: string, sent: unknown) {
  const store = getStore();
  const startedAt = Date.now();
  store.inflight += 1;

  return (status: number, got: unknown) => {
    store.inflight -= 1;
    store.calls.push({
      id: store.calls.length + 1,
      method,
      url,
      status,
      ms: Date.now() - startedAt,
      sent: sent === undefined ? undefined : slim(sent),
      got: slim(got),
    });
  };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Resolves with the recorded calls once no request has been running for a moment. Components of
 * one page render in parallel, so the panel has to wait for the others to finish their fetches.
 */
export async function waitForApiCalls(): Promise<DevApiCall[]> {
  const store = getStore();
  let quietTicks = 0;
  for (let tick = 0; tick < 100 && quietTicks < 3; tick += 1) {
    await sleep(40);
    quietTicks = store.inflight === 0 ? quietTicks + 1 : 0;
  }
  return store.calls;
}
