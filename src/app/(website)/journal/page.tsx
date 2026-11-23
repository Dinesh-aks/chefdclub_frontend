import { JournalPage } from "@/features/website/journal/JournalPage";

// CMS content: cached and rebuilt in the background at most once a minute, so edits show within ~60s.
export const revalidate = 60;

export default JournalPage;
