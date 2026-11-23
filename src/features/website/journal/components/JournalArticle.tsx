import Image from "next/image";
import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { CmsHtmlContent } from "@/features/website/cms-pages/components/CmsHtmlContent";
import { toGalleryAssetUrl } from "@/lib/api/gallery";
import type { PublicBlogPost, PublicBlogPostRelated } from "@/lib/api/blog";
import { JournalArticleHero } from "@/features/website/journal/components/JournalArticleHero";
import { JournalLikeButton } from "@/features/website/journal/components/JournalLikeButton";
import { JournalViewTracker } from "@/features/website/journal/components/JournalViewTracker";
import { JournalRecentPosts } from "@/features/website/journal/components/JournalRecentPosts";
import { JournalReserveCta } from "@/features/website/journal/components/JournalReserveCta";

interface JournalArticleProps {
  post: PublicBlogPost;
  /** A few other posts for the "Keep reading" row. */
  related: PublicBlogPostRelated[];
}

export function JournalArticle({ post, related }: JournalArticleProps) {
  return (
    <>
      <JournalViewTracker slug={post.slug} />
      <JournalArticleHero post={post} />

      <Section tone="default" padding="afterHero">
        {/* Article on the left, recent posts on the right (stacked on small screens). */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
          <Reveal className="min-w-0">
            {post.imageUrl ? (
              <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-lg border border-border bg-muted">
                <Image
                  src={toGalleryAssetUrl(post.imageUrl)}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50rem, 100vw"
                />
              </div>
            ) : null}

            <CmsHtmlContent
              html={post.description}
              className="text-foreground sm:text-lg [&_img]:h-auto [&_img]:max-w-full [&_figure]:my-6 [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic"
            />

            {post.video ? (
              <div className="mt-10 aspect-video overflow-hidden rounded-lg border border-border bg-muted">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(post.video)}`}
                  title={post.title}
                  className="size-full"
                  loading="lazy"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : null}

            {/* Like: its own client component, since it reads and changes per-reader state. */}
            <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">Enjoyed this post?</p>
              <JournalLikeButton slug={post.slug} initialCount={post.likeCount} />
            </div>
          </Reveal>

          {/* Sticks below the site header (sticky, ~10rem tall on desktop), and scrolls itself on short screens. */}
          <div className="lg:sticky lg:top-48 lg:max-h-[calc(100dvh-13rem)] lg:self-start lg:overflow-y-auto">
            <JournalRecentPosts posts={related} />
          </div>
        </div>
      </Section>

      <JournalReserveCta />
    </>
  );
}
