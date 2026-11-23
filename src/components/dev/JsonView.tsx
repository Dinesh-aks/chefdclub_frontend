"use client";

import { useState } from "react";

interface NodeProps {
  name?: string;
  value: unknown;
  depth: number;
  /** Objects and lists nested less deep than this start open. */
  openDepth: number;
  isLast: boolean;
}

function primitiveClass(value: unknown): string {
  if (typeof value === "string") return "text-emerald-300";
  if (typeof value === "number") return "text-amber-300";
  return "text-fuchsia-300";
}

function Node({ name, value, depth, openDepth, isLast }: NodeProps) {
  const [open, setOpen] = useState(depth < openDepth);
  const comma = isLast ? "" : ",";
  const label = name === undefined ? null : <span className="text-sky-300">&quot;{name}&quot;: </span>;

  // null, strings, numbers and booleans sit on one line.
  if (value === null || typeof value !== "object") {
    return (
      <div className="pl-4">
        {label}
        <span className={primitiveClass(value)}>{JSON.stringify(value)}</span>
        {comma}
      </div>
    );
  }

  const isArray = Array.isArray(value);
  const entries: [string | undefined, unknown][] = isArray
    ? (value as unknown[]).map((item) => [undefined, item])
    : Object.entries(value as Record<string, unknown>);
  const [openBracket, closeBracket] = isArray ? ["[", "]"] : ["{", "}"];
  const summary = isArray
    ? `${entries.length} ${entries.length === 1 ? "item" : "items"}`
    : `${entries.length} ${entries.length === 1 ? "key" : "keys"}`;

  if (!entries.length) {
    return (
      <div className="pl-4">
        {label}
        {openBracket}
        {closeBracket}
        {comma}
      </div>
    );
  }

  return (
    <div className="pl-4">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="-ml-4 inline-flex items-start gap-1 text-left hover:text-white"
        aria-expanded={open}
      >
        <span className="w-3 shrink-0 text-neutral-400" aria-hidden="true">
          {open ? "▾" : "▸"}
        </span>
        <span>
          {label}
          {openBracket}
          {open ? null : (
            <span className="text-neutral-400">
              {` ${summary} `}
              {closeBracket}
              {comma}
            </span>
          )}
        </span>
      </button>
      {open ? (
        <>
          {entries.map(([key, item], index) => (
            <Node
              key={key ?? index}
              name={key}
              value={item}
              depth={depth + 1}
              openDepth={openDepth}
              isLast={index === entries.length - 1}
            />
          ))}
          <div>
            {closeBracket}
            {comma}
          </div>
        </>
      ) : null}
    </div>
  );
}

/** A JSON value as a tree whose objects and lists can be collapsed and expanded. */
export function JsonView({ label, value }: { label: string; value: unknown }) {
  const [openDepth, setOpenDepth] = useState(2);
  // Changing the key rebuilds the tree, so "expand all" / "collapse all" reach every node.
  const [version, setVersion] = useState(0);

  function setAll(depth: number) {
    setOpenDepth(depth);
    setVersion((current) => current + 1);
  }

  return (
    <div className="mt-2">
      <div className="flex items-center gap-3">
        <p className="text-[10px] tracking-wider text-neutral-400 uppercase">{label}</p>
        {typeof value === "object" && value !== null ? (
          <>
            <button
              type="button"
              onClick={() => setAll(Number.POSITIVE_INFINITY)}
              className="text-[10px] text-sky-300 hover:underline"
            >
              Expand all
            </button>
            <button
              type="button"
              onClick={() => setAll(1)}
              className="text-[10px] text-sky-300 hover:underline"
            >
              Collapse all
            </button>
          </>
        ) : null}
      </div>
      <div className="mt-1 max-h-64 overflow-auto rounded bg-black/50 p-2 text-[11px] leading-snug text-neutral-200">
        {typeof value === "object" && value !== null ? (
          <div className="-ml-4">
            <Node key={version} value={value} depth={0} openDepth={openDepth} isLast />
          </div>
        ) : (
          <pre className="whitespace-pre-wrap">{String(value)}</pre>
        )}
      </div>
    </div>
  );
}
