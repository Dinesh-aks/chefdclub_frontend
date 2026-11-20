// Posts come from the CMS, so render on every request instead of freezing them at build time.
export const dynamic = "force-dynamic";

export {
  generateJournalPostMetadata as generateMetadata,
  JournalPostPage as default,
} from "@/features/website/journal/JournalPostPage";
