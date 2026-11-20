import Image from "next/image";
import { CalendarIcon, TagIcon, UserIcon } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { toGalleryAssetUrl } from "@/lib/api/gallery";
import type { PublicBlogPost } from "@/lib/api/blog";
import { formatJournalDate } from "@/features/website/journal/journalDate";

interface JournalArticleHeroProps {
  post: PublicBlogPost;
}

/**
 * Article header: the cover photo sits on the right and fades into the dark background, with the
 * title, a one-line teaser and a date / category / author row on the left.
 */
export function JournalArticleHero({ post }: JournalArticleHeroProps) {
  return (
    <Section tone="ink" padding="none" container={false} className="relative overflow-hidden">
      {post.imageUrl ? (
        <div className="absolute inset-y-0 right-0 w-full lg:w-[62%]" aria-hidden="true">
          <Image
            src={toGalleryAssetUrl(post.imageUrl)}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 60vw, 100vw"
          />
          {/* Small screens: a flat dark wash so the text stays readable. Large screens: only the left
              edge fades into the page colour, so the photo itself stays bright. */}
          <div className="absolute inset-0 max-lg:bg-background/70 lg:bg-gradient-to-r lg:from-background lg:via-background/25 lg:via-30% lg:to-transparent" />
        </div>
      ) : null}

      <Container className="relative z-10 py-12 md:py-16 lg:py-20">
        <Reveal className="max-w-3xl">
          <div className="mb-4 flex items-center gap-3 text-xs tracking-mega text-muted-foreground uppercase">
            <span className="h-px w-10 bg-primary" aria-hidden="true" />
            Journal
          </div>

          <h1 className="font-serif text-4xl leading-[1.05] font-normal text-balance sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          {post.excerpt ? (
            <p className="mt-6 max-w-xl font-serif text-lg leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          ) : null}

          <div className="mt-6 max-w-xl border-t border-border pt-5">
            <ul className="flex flex-wrap items-center gap-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CalendarIcon className="size-4" aria-hidden="true" />
                <time dateTime={post.publishDate}>{formatJournalDate(post.publishDate)}</time>
              </li>
              {post.categoryName ? (
                <li className="flex items-center gap-2 before:mx-4 before:h-4 before:w-px before:bg-border">
                  <TagIcon className="size-4" aria-hidden="true" />
                  {post.categoryName}
                </li>
              ) : null}
              {post.author ? (
                <li className="flex items-center gap-2 before:mx-4 before:h-4 before:w-px before:bg-border">
                  <UserIcon className="size-4" aria-hidden="true" />
                  By {post.author}
                </li>
              ) : null}
            </ul>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
