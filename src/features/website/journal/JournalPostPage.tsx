import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/core/client";
import { fetchPublicBlogPost, fetchPublicBlogPosts, JOURNAL_RELATED_FIELDS } from "@/lib/api/blog";
import { JournalArticle } from "@/features/website/journal/components/JournalArticle";

// One request per slug even though both the metadata and the page need the post.
const getPost = cache((slug: string) => fetchPublicBlogPost(slug));

// A missing or inactive post is a 404; any other error is a real failure and should surface.
async function loadPost(slug: string) {
  try {
    return (await getPost(slug)).data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export async function generateJournalPostMetadata({
  params,
}: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = (await getPost(slug)).data;
    return {
      title: `${post.seoTitle?.trim() || post.title} | Chef'd Club`,
      ...(post.seoDescription?.trim() ? { description: post.seoDescription.trim() } : {}),
    };
  } catch {
    return { title: "Journal | Chef'd Club" };
  }
}

// "Keep reading" is a nice-to-have, so a failure here must not take the article down.
async function loadRelated(slug: string) {
  try {
    return (await fetchPublicBlogPosts({ limit: 5, exclude: slug, fields: JOURNAL_RELATED_FIELDS })).data.items;
  } catch {
    return [];
  }
}

export async function JournalPostPage({ params }: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const [post, related] = await Promise.all([loadPost(slug), loadRelated(slug)]);

  return <JournalArticle post={post} related={related} />;
}
