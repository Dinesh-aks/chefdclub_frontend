import Image from "next/image";
import Link from "next/link";
import { toGalleryAssetUrl } from "@/lib/api/gallery";
import type { PublicBlogPostRelated } from "@/lib/api/blog";
import { formatJournalDate } from "@/features/website/journal/journalDate";

interface JournalRecentPostsProps {
  posts: PublicBlogPostRelated[];
}

/** Sidebar next to an article: the newest other posts, each with a small thumbnail. */
export function JournalRecentPosts({ posts }: JournalRecentPostsProps) {
  if (posts.length === 0) return null;

  return (
    <aside aria-label="Recent posts" className="border border-border p-6">
      <p className="text-xs tracking-mega text-primary uppercase">Recent posts</p>

      <ul className="mt-5 divide-y divide-border">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/journal/${post.slug}`}
              className="group flex gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="relative size-16 shrink-0 overflow-hidden bg-muted">
                {post.imageUrl ? (
                  <Image
                    src={toGalleryAssetUrl(post.imageUrl)}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="64px"
                  />
                ) : (
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-secondary via-muted to-accent"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="min-w-0">
                <time
                  dateTime={post.publishDate}
                  className="text-[11px] tracking-mega text-primary uppercase"
                >
                  {formatJournalDate(post.publishDate)}
                </time>
                <h3 className="mt-1 line-clamp-3 font-serif text-base leading-snug transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/journal"
        className="mt-6 inline-block border-b border-primary pb-0.5 text-xs tracking-mega uppercase transition-colors hover:text-primary"
      >
        All posts
      </Link>
    </aside>
  );
}
