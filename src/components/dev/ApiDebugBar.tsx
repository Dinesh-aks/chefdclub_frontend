import { waitForApiCalls } from "@/lib/api/core/devApiLog";
import { ApiDebugPanel } from "@/components/dev/ApiDebugPanel";

/**
 * Dev only: a floating panel listing the API calls this page made on the server (method, URL,
 * status, time, what was sent and what came back). Render it last in a layout, inside `<Suspense>`,
 * so it can wait for the page's own fetches to finish.
 */
export async function ApiDebugBar() {
  if (process.env.NODE_ENV === "production" || process.env.API_DEBUG === "false") return null;

  const calls = await waitForApiCalls();
  return <ApiDebugPanel calls={calls} />;
}
