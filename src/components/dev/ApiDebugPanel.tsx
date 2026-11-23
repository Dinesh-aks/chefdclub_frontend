"use client";

import { useState } from "react";
import { JsonView } from "@/components/dev/JsonView";
import type { DevApiCall } from "@/lib/api/core/devApiLog";

function statusClass(status: number): string {
  if (status === 0 || status >= 500) return "text-red-400";
  if (status >= 400) return "text-amber-300";
  return "text-emerald-400";
}

/** The floating button and list behind `ApiDebugBar`. Not for production. */
export function ApiDebugPanel({ calls }: { calls: DevApiCall[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed right-4 bottom-4 z-[9999] font-mono text-xs">
      {open ? (
        <div className="mb-2 w-[min(94vw,34rem)] rounded-lg border border-white/15 bg-neutral-900/95 p-3 text-neutral-100 shadow-2xl backdrop-blur">
          <p className="mb-2 text-neutral-400">
            Server-side API calls for this page (not visible in the Network tab)
          </p>
          {calls.length ? (
            <ul className="max-h-[65vh] space-y-1 overflow-auto">
              {calls.map((call) => (
                <li key={call.id} className="rounded border border-white/10 px-2 py-1.5">
                  <details>
                    <summary className="flex cursor-pointer items-start gap-2">
                      <span className="font-bold">{call.method}</span>
                      {/* The full URL wraps instead of being cut off. */}
                      <span className="min-w-0 flex-1 break-all">{call.url}</span>
                      <span className={statusClass(call.status)}>{call.status || "ERR"}</span>
                      <span className="text-neutral-400">{call.ms}ms</span>
                    </summary>
                    {call.sent !== undefined ? <JsonView label="sent" value={call.sent} /> : null}
                    <JsonView label="got" value={call.got} />
                  </details>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-400">No server-side API calls on this page.</p>
          )}
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="ml-auto flex items-center gap-2 rounded-full border border-white/20 bg-neutral-900 px-3 py-1.5 text-neutral-100 shadow-lg hover:bg-neutral-800"
        aria-expanded={open}
      >
        API
        <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
          {calls.length}
        </span>
      </button>
    </div>
  );
}
