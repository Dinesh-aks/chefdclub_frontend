import { notFound } from "next/navigation";
import { HighlightForm } from "@/features/admin/cms/highlights/HighlightForm";

export default async function AdminEditHighlightPage({
  params,
}: PageProps<"/admin/cms/highlights/[id]/edit">) {
  const { id } = await params;
  const highlightId = Number.parseInt(id, 10);

  if (!Number.isFinite(highlightId)) {
    notFound();
  }

  return <HighlightForm highlightId={highlightId} />;
}
