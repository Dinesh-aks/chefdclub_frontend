"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "@/components/shared/Container";
import { InkDots } from "@/components/shared/InkDots";
import { Section } from "@/components/shared/Section";
import { cn } from "@/lib/utils";
import { fetchPublicBlogPosts, JOURNAL_CARD_FIELDS, type PublicBlogPostCard } from "@/lib/api/blog";
import { JournalFeatured } from "@/features/website/journal/components/JournalFeatured";
import { JournalPostCell } from "@/features/website/journal/components/JournalPostCell";
import { JOURNAL_PAGE_SIZE } from "@/features/website/journal/journalConfig";

function chunkPosts<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

interface JournalGridProps {
  /** First page, rendered on the server so it is in the HTML. Newest first; the first post is featured. */
  initialPosts: PublicBlogPostCard[];
  totalPages: number;
}

export function JournalGrid({ initialPosts, totalPages }: JournalGridProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = page < totalPages;

  const loadMore = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setFailed(false);
    try {
      const next = page + 1;
      const response = await fetchPublicBlogPosts({ page: next, limit: JOURNAL_PAGE_SIZE, fields: JOURNAL_CARD_FIELDS });
      // A post added while reading shifts the pages, so skip anything already shown.
      setPosts((current) => {
        const seen = new Set(current.map((post) => post.slug));
        return [...current, ...response.data.items.filter((post) => !seen.has(post.slug))];
      });
      setPage(next);
    } catch {
      setFailed(true);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [page]);

  // Load the next page when the marker below the grid comes within ~400px of the viewport.
  // `page` is a dependency so the observer is re-created (and fires again) after each batch.
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || failed) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore();
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, failed, loadMore, page]);

  const [featured, ...gridPosts] = posts;
  const rows = chunkPosts(gridPosts, 3);

  if (!featured) {
    return (
      <Section tone="default" padding="afterHero">
        <p className="mx-auto max-w-xl text-center text-muted-foreground">
          No journal entries yet. Please check back soon.
        </p>
      </Section>
    );
  }

  return (
    <Section tone="default" padding="afterHero" container={false}>
      <Container className="max-w-7xl px-0 sm:px-0 lg:px-8">
        <div className="border border-border">
          <JournalFeatured post={featured} />

          {rows.map((row, rowIndex) => (
            <div
              key={row.map((post) => post.slug).join("-")}
              className="grid lg:grid-cols-3"
            >
              {row.map((post, columnIndex) => (
                <JournalPostCell
                  key={post.slug}
                  post={post}
                  className={cn(
                    columnIndex < row.length - 1 && "border-border lg:border-r",
                    rowIndex < rows.length - 1 && "border-border border-b",
                  )}
                />
              ))}
            </div>
          ))}
        </div>

        {hasMore ? <div ref={sentinelRef} aria-hidden="true" className="h-px" /> : null}

        {loading ? <InkDots label="Loading more posts" /> : null}

        {failed ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            <p>Couldn&rsquo;t load more posts.</p>
            <button
              type="button"
              onClick={() => void loadMore()}
              className="mt-3 border-b border-primary pb-0.5 text-xs tracking-mega text-foreground uppercase transition-colors hover:text-primary"
            >
              Try again
            </button>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
