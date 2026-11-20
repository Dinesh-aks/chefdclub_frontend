"use client";

import dynamic from "next/dynamic";
import type { RefObject } from "react";
import { toGalleryAssetUrl } from "@/lib/api/gallery";
import type { BlogCategoryRecord, BlogPostRecord } from "@/lib/api/blog";
import { AdminDateInput } from "@/components/admin/AdminDateInput";
import { AdminFileInput } from "@/components/admin/AdminFileInput";
import { FormCard } from "@/components/admin/FormSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BlogPostFormState } from "@/features/admin/cms/blog/blogPostFormConstants";
import { BlogPostSeoFields } from "@/features/admin/cms/blog/components/BlogPostSeoFields";
import { YoutubePreview } from "@/features/admin/cms/blog/components/YoutubePreview";

const RichTextEditor = dynamic(
  () => import("@/components/admin/RichTextEditor").then((mod) => mod.RichTextEditor),
  { ssr: false, loading: () => <div className="h-48 rounded-md border border-input bg-muted/40" /> },
);

interface BlogPostFormFieldsProps {
  form: BlogPostFormState;
  onChange: (form: BlogPostFormState) => void;
  categoryOptions: BlogCategoryRecord[];
  editing: boolean;
  post: BlogPostRecord | null;
  imageInputRef: RefObject<HTMLInputElement | null>;
}

export function BlogPostFormFields({
  form,
  onChange,
  categoryOptions,
  editing,
  post,
  imageInputRef,
}: BlogPostFormFieldsProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-5">
          <FormCard title="Basic Information" description="Title, URL slug, category, author and video.">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="post-title" required>Name</Label>
                <Input
                  id="post-title"
                  value={form.title}
                  onChange={(event) => onChange({ ...form, title: event.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-slug" required>Slug</Label>
                <Input
                  id="post-slug"
                  value={form.slug}
                  onChange={(event) => onChange({ ...form, slug: event.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-category" required>Category</Label>
                <Select value={form.catId} onValueChange={(value) => onChange({ ...form, catId: value })}>
                  <SelectTrigger id="post-category" className="w-full">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-author" required>Author</Label>
                <Input
                  id="post-author"
                  value={form.author}
                  onChange={(event) => onChange({ ...form, author: event.target.value })}
                  required
                />
              </div>
              {/* Video ID takes half the card (like Name / Slug); once typed, its preview fills the other half. */}
              <div className="grid items-start gap-5 sm:col-span-2 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="post-video">Post video (YouTube ID)</Label>
                  <Input
                    id="post-video"
                    value={form.video}
                    onChange={(event) => onChange({ ...form, video: event.target.value })}
                    placeholder="e.g. dQw4w9WgXcQ"
                  />
                  <p className="text-xs text-muted-foreground">
                    The 11-character code from the video link, e.g. youtube.com/watch?v=
                    <span className="font-medium">dQw4w9WgXcQ</span>. Optional.
                  </p>
                </div>
                <YoutubePreview value={form.video} />
              </div>
            </div>
          </FormCard>

          <FormCard title="SEO" description="Optional. Used for search engine results and link previews.">
            <BlogPostSeoFields form={form} onChange={onChange} />
          </FormCard>
        </div>

        <div className="min-w-0 space-y-5">
          <FormCard title="Publish" description="Visibility and the date shown on the Journal page.">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="post-status">Status</Label>
                <Select
                  value={form.status ? "active" : "inactive"}
                  onValueChange={(value) => onChange({ ...form, status: value === "active" })}
                >
                  <SelectTrigger id="post-status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-publish-date" required>Publish date</Label>
                <AdminDateInput
                  id="post-publish-date"
                  value={form.publishDate}
                  onChange={(publishDate) => onChange({ ...form, publishDate })}
                />
              </div>
            </div>
          </FormCard>

          <FormCard
            title="Cover Image"
            description={
              editing
                ? "Optional. A new upload replaces the current image."
                : "Upload the cover image for this post."
            }
          >
            <AdminFileInput
              id="post-image"
              inputRef={imageInputRef}
              currentImageUrl={post?.imageUrl ? toGalleryAssetUrl(post.imageUrl) : null}
              currentImageAlt={post?.title}
              className="flex-col items-stretch"
            />
          </FormCard>

        </div>
      </div>

      {/* Full width, below both columns: the editor needs the room. */}
      <FormCard title="Content" description="The article body shown on the post page.">
        <div className="space-y-2">
          <Label htmlFor="post-description" required>Description</Label>
          <RichTextEditor
            id="post-description"
            uploadFolder="journal"
            value={form.description}
            onChange={(value) => onChange({ ...form, description: value })}
          />
        </div>
      </FormCard>
    </div>
  );
}
