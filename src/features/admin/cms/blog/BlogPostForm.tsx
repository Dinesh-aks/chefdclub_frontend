"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { ApiError } from "@/lib/api/core/client";
import {
  createAdminBlogPost,
  fetchAdminBlogCategories,
  fetchAdminBlogPost,
  updateAdminBlogPost,
  type BlogCategoryRecord,
  type BlogPostRecord,
} from "@/lib/api/blog";
import { Button } from "@/components/ui/button";
import { InkDots } from "@/components/shared/InkDots";
import { FormActions } from "@/components/admin/FormActions";
import { BlogPostFormFields } from "@/features/admin/cms/blog/components/BlogPostFormFields";
import {
  EMPTY_BLOG_POST_FORM,
  type BlogPostFormState,
} from "@/features/admin/cms/blog/blogPostFormConstants";

interface BlogPostFormProps {
  postId?: number;
}

export function BlogPostForm({ postId }: BlogPostFormProps) {
  const router = useRouter();
  const editing = postId !== undefined;

  const [categories, setCategories] = useState<BlogCategoryRecord[]>([]);
  const [post, setPost] = useState<BlogPostRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [form, setForm] = useState<BlogPostFormState>(EMPTY_BLOG_POST_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [categoriesResponse, postResponse] = await Promise.all([
          fetchAdminBlogCategories({ limit: 100, page: 1 }),
          editing ? fetchAdminBlogPost(postId) : Promise.resolve(null),
        ]);
        if (cancelled) return;

        setCategories(categoriesResponse.data.items);

        if (postResponse) {
          const record = postResponse.data;
          setPost(record);
          setForm({
            catId: String(record.catId),
            author: record.author,
            title: record.title,
            slug: record.slug,
            description: record.description,
            video: record.video ?? "",
            publishDate: record.publishDate,
            seoTitle: record.seoTitle ?? "",
            seoDescription: record.seoDescription ?? "",
            status: record.status,
          });
        } else {
          const firstCategory = categoriesResponse.data.items[0];
          if (firstCategory) {
            setForm((prev) => ({ ...prev, catId: String(firstCategory.id) }));
          }
        }
        setLoadError("");
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof ApiError ? err.message : "Could not load this post.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [editing, postId]);

  const categoryOptions = useMemo(() => categories, [categories]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    if (!form.publishDate) {
      setFormError("Publish date is required.");
      return;
    }
    setSubmitting(true);
    const image = imageInputRef.current?.files?.[0];
    try {
      const payload = {
        catId: Number.parseInt(form.catId, 10),
        author: form.author,
        title: form.title,
        slug: form.slug,
        description: form.description,
        video: form.video || undefined,
        publishDate: form.publishDate,
        seoTitle: form.seoTitle || undefined,
        seoDescription: form.seoDescription || undefined,
        status: form.status,
        image,
      };
      if (editing) {
        await updateAdminBlogPost(postId, payload);
      } else {
        await createAdminBlogPost(payload);
      }
      router.push("/admin/cms/journal/posts");
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Could not save this post.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <header className="mb-5 space-y-3">
        <Link
          href="/admin/cms/journal/posts"
          className="inline-flex items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeftIcon className="size-4 shrink-0" aria-hidden="true" />
          Post List
        </Link>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{editing ? "Edit Post" : "Add Post"}</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {editing ? "Update this journal post" : "Create a new post for the public Journal page"}
          </p>
        </div>
      </header>

      {loading ? (
        <InkDots label="Loading" />
      ) : (
        <form onSubmit={handleSubmit}>
          {loadError ? <p className="mb-4 text-sm text-destructive">{loadError}</p> : null}

          <BlogPostFormFields
            form={form}
            onChange={setForm}
            categoryOptions={categoryOptions}
            editing={editing}
            post={post}
            imageInputRef={imageInputRef}
          />

          <FormActions error={formError}>
            <Button type="button" variant="outline" asChild className="sm:min-w-[5.5rem]">
              <Link href="/admin/cms/journal/posts">Cancel</Link>
            </Button>
            <Button type="submit" disabled={submitting} className="sm:min-w-[5.5rem]">
              {submitting ? "Saving…" : editing ? "Save post" : "Create post"}
            </Button>
          </FormActions>
        </form>
      )}
    </div>
  );
}
