import Link from "next/link";
import { TextLink } from "@/components/shared/TextLink";
import { cn } from "@/lib/utils";
import type { PublicBlogPostCard } from "@/lib/api/blog";
import { formatJournalDate } from "@/features/website/journal/journalDate";

interface JournalPostCellProps {
  post: PublicBlogPostCard;
  className?: string;
}

export function JournalPostCell({ post, className }: JournalPostCellProps) {
  return (
    <article
      className={cn(
        "flex min-h-[18rem] flex-col border-border p-6 sm:p-8 lg:min-h-[20rem]",
        className,
      )}
    >
      <Link href={`/journal/${post.slug}`} className="group flex flex-1 flex-col">
        <time
          dateTime={post.publishDate}
          className="text-xs tracking-mega text-primary uppercase"
        >
          {formatJournalDate(post.publishDate)}
        </time>
        <h2 className="mt-4 font-serif text-2xl leading-snug transition-colors group-hover:text-primary sm:text-3xl">
          {post.title}
        </h2>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {post.excerpt}
        </p>
      </Link>
      <TextLink href={`/journal/${post.slug}`} className="mt-6 self-start">
        Read
      </TextLink>
    </article>
  );
}
