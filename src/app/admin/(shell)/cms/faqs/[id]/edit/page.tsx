import { notFound } from "next/navigation";
import { FaqForm } from "@/features/admin/cms/faqs/FaqForm";

export default async function AdminEditFaqPage({
  params,
}: PageProps<"/admin/cms/faqs/[id]/edit">) {
  const { id } = await params;
  const faqId = Number.parseInt(id, 10);

  if (!Number.isFinite(faqId)) {
    notFound();
  }

  return <FaqForm faqId={faqId} />;
}
