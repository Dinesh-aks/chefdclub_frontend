import {
  fetchPublicBlogPosts,
  JOURNAL_CARD_FIELDS,
  type PublicBlogPostCard,
} from "@/lib/api/blog";
import { JournalGrid } from "@/features/website/journal/components/JournalGrid";
import { JournalHero } from "@/features/website/journal/components/JournalHero";
import { JOURNAL_PAGE_SIZE } from "@/features/website/journal/journalConfig";

/** First page for SSR — failures must not break prerender or the whole journal route. */
async function loadInitialJournalPosts(): Promise<{
  items: PublicBlogPostCard[];
  totalPages: number;
}> {
  try {
    const response = await fetchPublicBlogPosts({
      page: 1,
      limit: JOURNAL_PAGE_SIZE,
      fields: JOURNAL_CARD_FIELDS,
    });
    return { items: response.data.items, totalPages: response.data.totalPages };
  } catch {
    return { items: [], totalPages: 0 };
  }
}

export async function JournalPage() {
  const { items, totalPages } = await loadInitialJournalPosts();

  return (
    <>
      <JournalHero />
      <JournalGrid initialPosts={items} totalPages={totalPages} />
      {/* Subscribe section is hidden for now; to show it again, import JournalSubscribeSection and render it here. */}
    </>
  );
}
