"use client";

import { useEffect, useState } from "react";
import { HeartIcon } from "lucide-react";
import { fetchPublicBlogLike, togglePublicBlogLike } from "@/lib/api/blog";
import { cn } from "@/lib/utils";

interface JournalLikeButtonProps {
  slug: string;
  /** Like count rendered by the server; the browser then checks whether this reader already liked. */
  initialCount: number;
}

/** "Like" for an article: a heart that fills in, with the running count. */
export function JournalLikeButton({ slug, initialCount }: JournalLikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  // Whether *this* reader has liked it is only known per visitor, so it's looked up in the browser.
  useEffect(() => {
    let cancelled = false;
    fetchPublicBlogLike(slug)
      .then((response) => {
        if (cancelled) return;
        setCount(response.data.count);
        setLiked(response.data.liked);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    // Optimistic: flip right away, then settle on what the server says (or undo on failure).
    const previous = { count, liked };
    setLiked(!liked);
    setCount(liked ? Math.max(0, count - 1) : count + 1);
    try {
      const response = await togglePublicBlogLike(slug);
      setCount(response.data.count);
      setLiked(response.data.liked);
    } catch {
      setCount(previous.count);
      setLiked(previous.liked);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      aria-pressed={liked}
      className={cn(
        "inline-flex items-center gap-2.5 border px-5 py-2.5 text-xs tracking-mega uppercase transition-colors",
        liked
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-foreground hover:border-primary hover:text-primary",
      )}
    >
      <HeartIcon className={cn("size-4", liked && "fill-current")} aria-hidden="true" />
      {liked ? "Liked" : "Like"}
      <span className="tabular-nums text-muted-foreground">{count.toLocaleString()}</span>
    </button>
  );
}
