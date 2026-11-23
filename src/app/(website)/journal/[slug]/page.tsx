// CMS content: cached and rebuilt in the background at most once a minute, so edits show within ~60s.
export const revalidate = 60;

export {
  generateJournalPostMetadata as generateMetadata,
  JournalPostPage as default,
} from "@/features/website/journal/JournalPostPage";
