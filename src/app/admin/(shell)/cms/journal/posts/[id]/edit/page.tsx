import { notFound } from "next/navigation";
import { BlogPostForm } from "@/features/admin/cms/blog/BlogPostForm";

export default async function AdminEditBlogPostPage({
  params,
}: PageProps<"/admin/cms/journal/posts/[id]/edit">) {
  const { id } = await params;
  const postId = Number.parseInt(id, 10);

  if (!Number.isFinite(postId)) {
    notFound();
  }

  return <BlogPostForm postId={postId} />;
}
