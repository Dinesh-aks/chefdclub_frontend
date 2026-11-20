"use client";

import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildHref } from "@/lib/searchParams";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  /** For state-driven pagination (admin tables). Ignored when `getHref` is given. */
  onPageChange?: (page: number) => void;
  /**
   * For URL-driven pagination: each button becomes a link to `path?...&page=N`. Plain data (not a
   * function) so Server Components can pass it. `params` are the other query values to keep.
   */
  hrefBase?: {
    path: string;
    params?: Record<string, string | undefined>;
    /** The query key that holds the page number. Default "page". */
    pageParam?: string;
    /** An element id to jump to, so the page stays at this list instead of scrolling to the top. */
    hash?: string;
  };
  className?: string;
}

const SIBLING_COUNT = 1;

/** Builds a windowed page list with `null` standing in for an ellipsis, e.g.
 * [1, null, 4, 5, 6, null, 20] — so a table with hundreds of pages doesn't
 * render hundreds of buttons. */
function buildPageWindow(page: number, totalPages: number): (number | null)[] {
  const totalNumbers = SIBLING_COUNT * 2 + 5; // first + last + current + 2 siblings + 2 ellipses
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const leftSibling = Math.max(page - SIBLING_COUNT, 1);
  const rightSibling = Math.min(page + SIBLING_COUNT, totalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = Array.from({ length: 3 + SIBLING_COUNT * 2 }, (_, index) => index + 1);
    return [...leftRange, null, totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = Array.from(
      { length: 3 + SIBLING_COUNT * 2 },
      (_, index) => totalPages - (3 + SIBLING_COUNT * 2) + 1 + index,
    );
    return [1, null, ...rightRange];
  }

  const middleRange = Array.from({ length: rightSibling - leftSibling + 1 }, (_, index) => leftSibling + index);
  return [1, null, ...middleRange, null, totalPages];
}

/** Pagination controls. Either state-driven (`onPageChange`) or URL-driven (`hrefBase`), where
 * every page change is a real navigation, so the server loads just that page's data. */
export function Pagination({ page, totalPages, onPageChange, hrefBase, className }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  // Page 1 is the plain address, with no "page" value.
  const getHref = hrefBase
    ? (target: number) =>
        buildHref(hrefBase.path, {
          ...hrefBase.params,
          [hrefBase.pageParam ?? "page"]: target > 1 ? target : undefined,
        }) + (hrefBase.hash ? `#${hrefBase.hash}` : "")
    : undefined;

  const pages = buildPageWindow(page, totalPages);

  // One control: a link when `getHref` is set, otherwise a button; disabled ones are never links.
  function control(
    target: number,
    props: { disabled?: boolean; label: string; current?: boolean; children: React.ReactNode },
  ) {
    const variant = props.current ? "default" : "outline";
    if (getHref && !props.disabled) {
      return (
        <Button
          variant={variant}
          size="icon-sm"
          asChild
          aria-label={props.current ? undefined : props.label}
        >
          <Link href={getHref(target)} aria-current={props.current ? "page" : undefined}>
            {props.children}
          </Link>
        </Button>
      );
    }
    return (
      <Button
        variant={variant}
        size="icon-sm"
        disabled={props.disabled}
        onClick={() => onPageChange?.(target)}
        aria-label={props.current ? undefined : props.label}
        aria-current={props.current ? "page" : undefined}
      >
        {props.children}
      </Button>
    );
  }

  return (
    <nav
      aria-label="Pagination"
      className={cn("mt-12 flex flex-wrap items-center justify-center gap-2", className)}
    >
      {control(1, {
        disabled: page === 1,
        label: "First page",
        children: <ChevronsLeftIcon aria-hidden="true" />,
      })}
      {control(page - 1, {
        disabled: page === 1,
        label: "Previous page",
        children: <ChevronLeftIcon aria-hidden="true" />,
      })}

      {pages.map((pageNumber, index) =>
        pageNumber === null ? (
          <span
            key={`ellipsis-${index}`}
            className="flex size-8 items-center justify-center text-sm text-muted-foreground"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <span key={pageNumber}>
            {control(pageNumber, {
              label: `Page ${pageNumber}`,
              current: pageNumber === page,
              children: pageNumber,
            })}
          </span>
        ),
      )}

      {control(page + 1, {
        disabled: page === totalPages,
        label: "Next page",
        children: <ChevronRightIcon aria-hidden="true" />,
      })}
      {control(totalPages, {
        disabled: page === totalPages,
        label: "Last page",
        children: <ChevronsRightIcon aria-hidden="true" />,
      })}
    </nav>
  );
}
