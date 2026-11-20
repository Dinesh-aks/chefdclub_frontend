import { notFound } from "next/navigation";
import { SpotlightForm } from "@/features/admin/cms/spotlight/SpotlightForm";

export default async function AdminEditSpotlightPage({
  params,
}: PageProps<"/admin/cms/spotlight/[id]/edit">) {
  const { id } = await params;
  const cardId = Number.parseInt(id, 10);

  if (!Number.isFinite(cardId)) {
    notFound();
  }

  return <SpotlightForm cardId={cardId} />;
}
