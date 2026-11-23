import { notFound } from "next/navigation";
import { MenuCardForm } from "@/features/admin/cms/menu-cards/MenuCardForm";

export default async function AdminEditMenuCardPage({
  params,
}: PageProps<"/admin/cms/menu-cards/[id]/edit">) {
  const { id } = await params;
  const cardId = Number.parseInt(id, 10);

  if (!Number.isFinite(cardId)) {
    notFound();
  }

  return <MenuCardForm cardId={cardId} />;
}
