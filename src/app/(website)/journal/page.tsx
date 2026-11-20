import { JournalPage } from "@/features/website/journal/JournalPage";

// Posts come from the CMS, so render on every request instead of freezing them at build time.
export const dynamic = "force-dynamic";

export default JournalPage;
