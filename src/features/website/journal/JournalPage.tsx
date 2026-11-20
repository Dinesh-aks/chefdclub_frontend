import { fetchPublicBlogPosts, JOURNAL_CARD_FIELDS } from "@/lib/api/blog";
import { JournalGrid } from "@/features/website/journal/components/JournalGrid";
import { JournalHero } from "@/features/website/journal/components/JournalHero";
import { JOURNAL_PAGE_SIZE } from "@/features/website/journal/journalConfig";

export async function JournalPage() {
  // Only the first page is fetched here (so it's in the HTML); the grid loads the rest on scroll.
  const response = await fetchPublicBlogPosts({ page: 1, limit: JOURNAL_PAGE_SIZE, fields: JOURNAL_CARD_FIELDS });

  return (
    <>
      <JournalHero />
      <JournalGrid initialPosts={response.data.items} totalPages={response.data.totalPages} />
      {/* Subscribe section is hidden for now; to show it again, import JournalSubscribeSection and render it here. */}
    </>
  );
}
