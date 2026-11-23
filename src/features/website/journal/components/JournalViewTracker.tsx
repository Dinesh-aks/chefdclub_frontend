"use client";

import { useEffect } from "react";
import { recordPublicBlogView } from "@/lib/api/blog";

/**
 * Counts one view when an article is opened. It runs in the reader's browser (so the backend sees
 * the reader's IP, not the Next.js server's), and only once per browser tab session per post, so
 * refreshing the page or React's dev double-run doesn't inflate the number.
 */
export function JournalViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `journal-viewed:${slug}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      // Storage can be blocked (private mode); counting anyway is better than not counting.
    }
    void recordPublicBlogView(slug).catch(() => undefined);
  }, [slug]);

  return null;
}
