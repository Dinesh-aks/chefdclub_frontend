import { notFound } from "next/navigation";
import { MenuCategoryForm } from "@/features/admin/cms/menu-categories/MenuCategoryForm";

export default async function AdminEditMenuCategoryPage({
  params,
}: PageProps<"/admin/cms/menu-categories/[id]/edit">) {
  const { id } = await params;
  const categoryId = Number.parseInt(id, 10);

  if (!Number.isFinite(categoryId)) {
    notFound();
  }

  return <MenuCategoryForm categoryId={categoryId} />;
}
