import Image from "next/image";
import Link from "next/link";
import { TextLink } from "@/components/shared/TextLink";
import { toGalleryAssetUrl } from "@/lib/api/gallery";
import type { PublicBlogPostCard } from "@/lib/api/blog";
import { formatJournalDate } from "@/features/website/journal/journalDate";

interface JournalFeaturedProps {
  post: PublicBlogPostCard;
}

export function JournalFeatured({ post }: JournalFeaturedProps) {
  const dateLabel = formatJournalDate(post.publishDate);

  return (
    <div className="grid border-b border-border lg:grid-cols-3">
      <Link
        href={`/journal/${post.slug}`}
        className="group relative min-h-[16rem] overflow-hidden bg-muted lg:col-span-2 lg:min-h-[22rem]"
      >
        {post.imageUrl ? (
          <Image
            src={toGalleryAssetUrl(post.imageUrl)}
            alt={post.title}
            fill
            priority
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(min-width: 1024px) 66vw, 100vw"
          />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-secondary via-muted to-accent"
            aria-hidden="true"
          />
        )}
      </Link>

      <article className="flex flex-col border-t border-border p-6 sm:p-8 lg:border-t-0 lg:border-l">
        <Link href={`/journal/${post.slug}`} className="group flex flex-1 flex-col">
          <time
            dateTime={post.publishDate}
            className="text-xs tracking-mega text-primary uppercase"
          >
            {dateLabel}
          </time>
          <h2 className="mt-4 font-serif text-3xl leading-snug transition-colors group-hover:text-primary sm:text-4xl">
            {post.title}
          </h2>
          <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {post.excerpt}
          </p>
        </Link>
        <TextLink href={`/journal/${post.slug}`} className="mt-6 self-start">
          Read the essay
        </TextLink>
      </article>
    </div>
  );
}
